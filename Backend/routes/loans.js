const express = require('express')
const Loan = require('../models/Loan')

const router = express.Router()

function parsePositiveInt(value, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  const i = Math.floor(n)
  if (i <= 0) return fallback
  return i
}

function normalizeString(v) {
  const s = String(v ?? '').trim()
  return s.length ? s : null
}

function toDateOrNull(v) {
  if (v === null) return null
  if (v === undefined) return undefined
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return undefined
  return d
}

function publicLoan(loan) {
  return loan.toJSON()
}

router.get('/', async (req, res, next) => {
  try {
    const borrower_id = normalizeString(req.query?.borrower_id)
    const copy_id = normalizeString(req.query?.copy_id)
    const status = normalizeString(req.query?.status)

    const page = parsePositiveInt(req.query?.page, 1)
    const limit = parsePositiveInt(req.query?.limit, 20)
    const skip = (page - 1) * limit

    const filter = {}

    if (borrower_id) filter.borrower_id = borrower_id
    if (copy_id) filter.copy_id = copy_id

    if (status === 'active') filter.return_date = null
    if (status === 'returned') filter.return_date = { $ne: null }
    if (status === 'overdue') {
      filter.return_date = null
      filter.due_date = { $lt: new Date() }
    }

    const [items, total] = await Promise.all([
      Loan.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('borrower_id'),
      Loan.countDocuments(filter),
    ])

    res.json({
      items: items.map(publicLoan),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = String(req.params?.id || '').trim()
    const loan = await Loan.findById(id).populate('borrower_id')
    if (!loan) return res.status(404).json({ message: 'Loan not found' })
    res.json({ loan: publicLoan(loan) })
  } catch (err) {
    if (err?.name === 'CastError') return res.status(400).json({ message: 'Invalid id' })
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const copy_id = normalizeString(req.body?.copy_id)
    const borrower_id = normalizeString(req.body?.borrower_id)
    const borrow_date = toDateOrNull(req.body?.borrow_date)
    const due_date = toDateOrNull(req.body?.due_date)
    const return_date = toDateOrNull(req.body?.return_date)

    if (!copy_id) return res.status(400).json({ message: 'copy_id is required' })
    if (!borrower_id) return res.status(400).json({ message: 'borrower_id is required' })
    if (!borrow_date) return res.status(400).json({ message: 'borrow_date is required' })
    if (!due_date) return res.status(400).json({ message: 'due_date is required' })

    const created = await Loan.create({
      copy_id,
      borrower_id,
      borrow_date,
      due_date,
      return_date: return_date === undefined ? null : return_date,
    })

    const populated = await Loan.findById(created._id).populate('borrower_id')
    res.status(201).json({ loan: publicLoan(populated ?? created) })
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const id = String(req.params?.id || '').trim()

    const update = {}

    if (req.body?.copy_id !== undefined) update.copy_id = normalizeString(req.body?.copy_id)
    if (req.body?.borrower_id !== undefined) update.borrower_id = normalizeString(req.body?.borrower_id)
    if (req.body?.borrow_date !== undefined) update.borrow_date = toDateOrNull(req.body?.borrow_date)
    if (req.body?.due_date !== undefined) update.due_date = toDateOrNull(req.body?.due_date)
    if (req.body?.return_date !== undefined) update.return_date = toDateOrNull(req.body?.return_date)

    const updated = await Loan.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true }).populate(
      'borrower_id'
    )
    if (!updated) return res.status(404).json({ message: 'Loan not found' })

    res.json({ loan: publicLoan(updated) })
  } catch (err) {
    if (err?.name === 'CastError') return res.status(400).json({ message: 'Invalid id' })
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const id = String(req.params?.id || '').trim()
    const deleted = await Loan.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ message: 'Loan not found' })
    res.json({ ok: true })
  } catch (err) {
    if (err?.name === 'CastError') return res.status(400).json({ message: 'Invalid id' })
    next(err)
  }
})

module.exports = router
