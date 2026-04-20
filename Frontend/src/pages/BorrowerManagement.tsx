import { useState, useEffect } from "react"
import { Search01Icon, Add01Icon, Edit02Icon, Delete01Icon, User03Icon, Calendar01Icon, Mail02Icon, AiPhone01Icon, MapPinpoint01Icon, BookOpen01Icon } from "hugeicons-react"

interface Borrower {
  id: string
  name: string
  email: string
  phone: string
  address: string
  membershipDate: string
  status: 'active' | 'inactive' | 'suspended'
  totalBorrowed: number
  currentBorrowed: number
  overdueBooks: number
}

interface BorrowingHistory {
  id: string
  bookTitle: string
  bookId: string
  borrowDate: string
  dueDate: string
  returnDate: string | null
  status: 'borrowed' | 'returned' | 'overdue'
}

const BorrowerManagement = () => {
  const [borrowers, setBorrowers] = useState<Borrower[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null)
  const [borrowingHistory, setBorrowingHistory] = useState<BorrowingHistory[]>([])

  // Mock data
  useEffect(() => {
    const mockBorrowers: Borrower[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 234-567-8900',
        address: '123 Main St, City, State',
        membershipDate: '2023-01-15',
        status: 'active',
        totalBorrowed: 25,
        currentBorrowed: 3,
        overdueBooks: 0
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 234-567-8901',
        address: '456 Oak Ave, City, State',
        membershipDate: '2023-03-20',
        status: 'active',
        totalBorrowed: 18,
        currentBorrowed: 2,
        overdueBooks: 1
      },
      {
        id: '3',
        name: 'Michael Davis',
        email: 'm.davis@email.com',
        phone: '+1 234-567-8902',
        address: '789 Pine Rd, City, State',
        membershipDate: '2022-11-10',
        status: 'suspended',
        totalBorrowed: 42,
        currentBorrowed: 5,
        overdueBooks: 3
      }
    ]
    setBorrowers(mockBorrowers)
  }, [])

  useEffect(() => {
    if (selectedBorrower) {
      const mockHistory: BorrowingHistory[] = [
        {
          id: '1',
          bookTitle: 'The Great Gatsby',
          bookId: 'ISBN:9780743273565',
          borrowDate: '2024-03-01',
          dueDate: '2024-03-15',
          returnDate: '2024-03-14',
          status: 'returned'
        },
        {
          id: '2',
          bookTitle: 'Atomic Habits',
          bookId: 'ISBN:9780735211292',
          borrowDate: '2024-03-10',
          dueDate: '2024-03-24',
          returnDate: null,
          status: 'borrowed'
        },
        {
          id: '3',
          bookTitle: 'The Hobbit',
          bookId: 'ISBN:9780345339683',
          borrowDate: '2024-02-15',
          dueDate: '2024-02-29',
          returnDate: null,
          status: 'overdue'
        }
      ]
      setBorrowingHistory(mockHistory)
    }
  }, [selectedBorrower])

  const filteredBorrowers = borrowers.filter(borrower =>
    borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrower.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrower.phone.includes(searchTerm)
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getHistoryStatusColor = (status: string) => {
    switch (status) {
      case 'returned': return 'bg-green-100 text-green-800'
      case 'borrowed': return 'bg-blue-100 text-blue-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Borrower Management</h1>
        <p className="text-sm text-gray-600 mt-1">Track and manage library members</p>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search01Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search borrowers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="button"
            onClick={() => {}}
            className="h-12 px-5 rounded-xl bg-black text-white text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <Add01Icon size={18} />
            Add Borrower
          </button>
        </div>
        <div className="flex gap-2">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Total Borrowers</p>
            <p className="text-2xl font-bold w-[200px]">{borrowers.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Active Now</p>
            <p className="text-2xl font-bold w-[200px] text-black">
              {borrowers.filter((b) => b.status === 'active').length}
            </p>
          </div>
        </div>
      </div>

      {/* Borrowers List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Borrowers List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrower
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Books
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBorrowers.map((borrower) => (
                <tr key={borrower.id} className="hover:bg-gray-50 cursor-pointer">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={() => setSelectedBorrower(borrower)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User03Icon size={20} className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{borrower.name}</div>
                        <div className="text-sm text-gray-500">Member since {borrower.membershipDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{borrower.email}</div>
                    <div className="text-sm text-gray-500">{borrower.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(borrower.status)}`}>
                      {borrower.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{borrower.currentBorrowed} / {borrower.totalBorrowed}</div>
                    {borrower.overdueBooks > 0 && (
                      <div className="text-sm text-red-600">{borrower.overdueBooks} overdue</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBorrower(borrower)
                      }}
                      className="text-gray-600 hover:text-gray-900 mr-3"
                    >
                      <Edit02Icon size={18} />
                    </button>
                    <button type="button" className="text-red-600 hover:text-red-900">
                      <Delete01Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Borrower Details & History */}
      {selectedBorrower && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) setSelectedBorrower(null)
          }}
        >
          <div className="w-full max-w-5xl rounded-xl bg-white border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Borrower Details</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setSelectedBorrower(null)}
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-h-[80vh] overflow-y-auto">
              <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Borrower Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <User03Icon size={40} className="text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedBorrower.name}</p>
                    <span className={`inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedBorrower.status)}`}>
                      {selectedBorrower.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail02Icon size={16} />
                      {selectedBorrower.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AiPhone01Icon size={16} />
                      {selectedBorrower.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinpoint01Icon size={16} />
                      {selectedBorrower.address}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar01Icon size={16} />
                      Member since {selectedBorrower.membershipDate}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Borrowing History</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {borrowingHistory.map((history) => (
                      <div key={history.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <BookOpen01Icon size={20} className="text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{history.bookTitle}</p>
                            <p className="text-sm text-gray-500">{history.bookId}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-gray-500">
                                Borrowed: {history.borrowDate}
                              </span>
                              <span className="text-xs text-gray-500">
                                Due: {history.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getHistoryStatusColor(history.status)}`}>
                            {history.status}
                          </span>
                          {history.returnDate && (
                            <p className="text-xs text-gray-500 mt-1">Returned: {history.returnDate}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BorrowerManagement
