import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Book02Icon,
  BookOpen01Icon,
  Clock01Icon,
  UserCircleIcon,
} from 'hugeicons-react'
import type { ReactNode } from 'react'

const StatCard = ({
  icon,
  iconBgClassName,
  trend,
  metricLabel,
  metricValue,
}: {
  icon: ReactNode
  iconBgClassName: string
  trend?: {
    text: string
    direction: 'up' | 'down'
    toneClassName: string
  }
  metricLabel: string
  metricValue: string
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${iconBgClassName}`}>{icon}</div>

        {trend ? (
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${trend.toneClassName}`}
          >
            {trend.direction === 'up' ? <ArrowUp01Icon size={14} /> : <ArrowDown01Icon size={14} />}
            <span>{trend.text}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600">{metricLabel}</p>
        <p className="text-2xl font-semibold text-gray-900">{metricValue}</p>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const recentActivity = [
    {
      id: 'a1',
      text: 'Book "The Great Gatsby" was returned',
      time: '2 hours ago',
      icon: <BookOpen01Icon size={18} />,
    },
    {
      id: 'a2',
      text: 'New borrower registered',
      time: 'Yesterday',
      icon: <UserCircleIcon size={18} />,
    },
    {
      id: 'a3',
      text: 'Payment received for overdue fees',
      time: '2 days ago',
      icon: <Clock01Icon size={18} />,
    },
  ]

  const popularBooks = [
    { id: 'p1', title: 'Atomic Habits', author: 'James Clear' },
    { id: 'p2', title: '1984', author: 'George Orwell' },
    { id: 'p3', title: 'Sapiens', author: 'Yuval Noah Harari' },
    { id: 'p4', title: 'The Pragmatic Programmer', author: 'Andrew Hunt' },
  ]

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-md font-light text-gray-600 mt-2">Welcome Back! Administrator</p>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Book02Icon size={22} />}
          iconBgClassName="bg-blue-100"
          trend={{ text: '+12%', direction: 'up', toneClassName: 'bg-green-100 text-green-800' }}
          metricLabel="Total Books"
          metricValue="15,847"
        />

        <StatCard
          icon={<UserCircleIcon size={22} />}
          iconBgClassName="bg-purple-100"
          trend={{ text: '+8%', direction: 'up', toneClassName: 'bg-green-100 text-green-800' }}
          metricLabel="Active Borrowers"
          metricValue="2,341"
        />

        <StatCard
          icon={<BookOpen01Icon size={22} />}
          iconBgClassName="bg-green-100"
          trend={{ text: '+25%', direction: 'up', toneClassName: 'bg-green-100 text-green-800' }}
          metricLabel="Books Borrowed Today"
          metricValue="87"
        />

        <StatCard
          icon={<Clock01Icon size={22} />}
          iconBgClassName="bg-orange-100"
          trend={{
            text: '23 Overdue',
            direction: 'down',
            toneClassName: 'bg-red-100 text-red-800',
          }}
          metricLabel="Pending Returns"
          metricValue="234"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="items-center gap-3">
              <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
              >
                <div className="rounded-lg bg-blue-100 text-blue-700 p-2">{item.icon}</div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.text}</p>
                  <p className="text-xs text-gray-600 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className=" items-center gap-3">
              <h2 className="text-base font-semibold text-gray-900">Popular Books</h2>
            </div>
          </div>

          <div className="mt-4 space-y-5 relative">
            {popularBooks.map((book, idx) => (
              <div
                key={book.id}
                className="flex items-center gap-3 border border-gray-200 bg-gray-50 p-3 pl-12 relative"
              >
                <div
                  className="text-8xl font-bold absolute left-[-17px] top-[80px] -translate-y-1/2 text-transparent pointer-events-none z-0 leading-none"
                  style={{ WebkitTextStroke: '1px rgb(0 0 0)' }}
                >
                  {idx + 1}
                </div>
                <div className="absolute z-20 left-3 w-[45px] h-16 rounded bg-white border border-gray-200 overflow-hidden" />
                <div className="min-w-0 relative z-10 ml-4 ">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{book.title}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
