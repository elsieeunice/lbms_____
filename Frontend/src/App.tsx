import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen">
      {!isLoginPage && (
        <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      )}
      <main
        className={`min-h-screen transition-[padding-left] duration-300 ease-in-out ${
          isLoginPage ? '' : sidebarCollapsed ? 'pl-[100px]' : 'pl-80'
        }`}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<BookCatalog />} />
          <Route path="/books/search" element={<BookCatalog />} />
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
