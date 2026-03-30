import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import BookCatalog from './pages/BookCatalog'
import BorrowerManagement from './pages/BorrowerManagement'
import InventoryManagement from './pages/InventoryManagement'
import Analytics from './pages/Analytics'
import Login from './pages/Login'

function AppContent() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <div className="flex min-h-screen">
      {!isLoginPage && <Sidebar />}
      <main className={`flex-1 ${isLoginPage ? '' : 'p-8'}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<BookCatalog />} />
          <Route path="/borrowers" element={<BorrowerManagement />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
