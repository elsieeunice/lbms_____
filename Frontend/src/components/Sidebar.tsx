import {
  Analytics02Icon,
  Bookshelf01Icon,
  DashboardSquare01Icon,
  Recycle03Icon,
  Search01Icon,
  SidebarLeft01Icon,
  StoreManagement01Icon,
} from 'hugeicons-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardSquare01Icon/> },
    { path: '/books', label: 'Book Catalog', icon: <Bookshelf01Icon/> },
    { path: '/borrowers', label: 'Borrower Management', icon: <Recycle03Icon/> },
    { path: '/inventory', label: 'Inventory', icon: <StoreManagement01Icon/> },
    { path: '/analytics', label: 'Analytics', icon: <Analytics02Icon/> },
  ]

  return (
    <div
      className={`min-h-screen border-r border-slate-700/10 bg-white p-6 overflow-hidden transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-[100px]' : 'w-80'
      }`}
    >
      <div className={`flex relative justify-${collapsed ? 'center' : 'between'} items-center mb-4 mt-2 transition-[transform, opacity] duration-300 ease-in-out ${
        collapsed ? 'opacity-100' : 'opacity-100'
      }`}>
        <h2
          className={`text-md font-light text-black transition-opacity duration-300 ${
            !collapsed ? 'opacity-100' : 'opacity-0 hidden pointer-events-none'
          }`}
          style={{ transform: collapsed ? 'translateX(0)' : 'translateX(0%)' }}
        >
          LBMS
        </h2>
        <button
          type='button'
          onClick={() => setCollapsed((v) => !v)}
          className='text-gray-700 transition'
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ transform: collapsed ? 'translateX(0%)' : 'translateX(50%)' }}
        >
          <SidebarLeft01Icon />
        </button>
      </div>
      
      <div className='bg-gray-200 rounded-xl py-2 px-2 flex items-center gap-2 mb-4'>
        <div className='bg-white p-2 rounded-xl'>
          <Search01Icon size={20} />
        </div>
        {!collapsed && (
          <input type="text" placeholder='Search.....' className='bg-transparent outline-none' />
        )}
      </div>

      <nav>
        <p className={`mb-4 text-sm text-gray-800 font-semibold ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>Navigation</p>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-4 text-md transition ${
                  location.pathname === item.path
                    ? 'bg-gray-300 text-black'
                    : 'text-gray-500 hover:bg-gray-300 hover:text-white'
                } ${
                  collapsed ? 'justify-center px-6 py-2' : ''
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center ${
                    location.pathname === item.path
                      ? 'text-black '
                      : 'text-gray-500 group-hover:text-white'
                  }`}
                >
                  {item.icon}
                </span>
                {!collapsed && <span className='whitespace-nowrap'>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
