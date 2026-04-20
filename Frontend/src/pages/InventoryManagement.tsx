import { useState, useEffect } from "react"
import { Search01Icon, Add01Icon, Edit02Icon, Delete01Icon, BookOpen01Icon, Calendar01Icon, Tag01Icon, Package01Icon } from "hugeicons-react"

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  totalCopies: number
  availableCopies: number
  borrowedCopies: number
  status: 'available' | 'borrowed' | 'unavailable' | 'maintenance'
  addedDate: string
}

const InventoryManagement = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    // Mock data
    const mockBooks: Book[] = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5',
        category: 'Fiction',
        totalCopies: 5,
        availableCopies: 3,
        borrowedCopies: 2,
        status: 'available',
        addedDate: '2023-01-15'
      },
      {
        id: '2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0-06-112008-4',
        category: 'Fiction',
        totalCopies: 3,
        availableCopies: 0,
        borrowedCopies: 3,
        status: 'borrowed',
        addedDate: '2023-02-20'
      },
      {
        id: '3',
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0-452-28423-4',
        category: 'Dystopian',
        totalCopies: 4,
        availableCopies: 2,
        borrowedCopies: 2,
        status: 'available',
        addedDate: '2023-03-10'
      },
      {
        id: '4',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        isbn: '978-0-14-143951-8',
        category: 'Romance',
        totalCopies: 2,
        availableCopies: 1,
        borrowedCopies: 1,
        status: 'available',
        addedDate: '2023-04-05'
      }
    ]
    setBooks(mockBooks)
  }, [])

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'borrowed': return 'bg-blue-100 text-blue-800'
      case 'unavailable': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Inventory Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and track library books</p>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search01Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="h-12 px-5 rounded-xl bg-black text-white text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <Add01Icon size={18} />
            Add Book
          </button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Total Books</p>
            <p className="text-2xl font-bold text-gray-900">{books.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Available</p>
            <p className="text-2xl font-bold text-green-600">
              {books.filter((b) => b.status === 'available').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Borrowed</p>
            <p className="text-2xl font-bold text-blue-600">
              {books.filter((b) => b.status === 'borrowed').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Total Copies</p>
            <p className="text-2xl font-bold text-gray-900">
              {books.reduce((sum, book) => sum + book.totalCopies, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Books List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Books Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 cursor-pointer">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <BookOpen01Icon size={20} className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        <div className="text-sm text-gray-500">Added {book.addedDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{book.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{book.isbn}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{book.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(book.status)}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{book.availableCopies} / {book.totalCopies}</div>
                    {book.borrowedCopies > 0 && (
                      <div className="text-sm text-blue-600">{book.borrowedCopies} borrowed</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="text-gray-600 hover:text-gray-900 mr-3"
                    >
                      <Edit02Icon size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Delete01Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Details */}
      {selectedBook && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Book Details</h2>
            <button
              onClick={() => setSelectedBook(null)}
              className="text-gray-400 hover:text-gray-600"
            >
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">{selectedBook.title}</h3>
              <p className="text-sm text-gray-600 mb-4">by {selectedBook.author}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag01Icon size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">ISBN: {selectedBook.isbn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package01Icon size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Category: {selectedBook.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar01Icon size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Added: {selectedBook.addedDate}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Copy Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Copies:</span>
                  <span className="font-medium">{selectedBook.totalCopies}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium text-green-600">{selectedBook.availableCopies}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Borrowed:</span>
                  <span className="font-medium text-blue-600">{selectedBook.borrowedCopies}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Add New Book</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Add book functionality would be implemented here.
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Edit Book</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Edit book functionality would be implemented here.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryManagement
