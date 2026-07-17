import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import QuickAddModal from './components/QuickAddModal'
import TaskDetailModal from './components/TaskDetailModal'
import Toasts from './components/Toasts'
import Confetti from './components/Confetti'
import AIAssistant from './components/AIAssistant'
import Login from './components/Login'
import Icon from './components/Icon'
import { useStore } from './store'
import { cx } from './lib/utils'

import Dashboard from './pages/Dashboard'
import TasksView from './pages/TasksView'
import Calendar from './pages/Calendar'
import Kanban from './pages/Kanban'
import Categories from './pages/Categories'
import Analytics from './pages/Analytics'
import Notes from './pages/Notes'
import Pomodoro from './pages/Pomodoro'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

const MOBILE_NAV = [
  { id: 'dashboard', icon: 'LayoutDashboard' },
  { id: 'today', icon: 'Sun' },
  { id: 'calendar', icon: 'CalendarDays' },
  { id: 'profile', icon: 'UserCircle' },
]

export default function App() {
  const { activeView, setView, darkMode, loggedIn, login } = useStore()
  const [quickAdd, setQuickAdd] = useState(false)
  const [detail, setDetail] = useState(null)
  const [search, setSearch] = useState('')

  const onSearch = (val) => {
    setSearch(val)
    if (val.trim()) setView('today')
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  if (!loggedIn) return <Login onLogin={login} />

  const renderView = () => {
    const props = { onOpenTask: setDetail, onQuickAdd: () => setQuickAdd(true) }
    switch (activeView) {
      case 'dashboard': return <Dashboard {...props} />
      case 'today': return <TasksView scope="today" query={search} {...props} />
      case 'upcoming': return <TasksView scope="upcoming" query={search} {...props} />
      case 'calendar': return <Calendar {...props} />
      case 'kanban': return <Kanban {...props} />
      case 'categories': return <Categories {...props} />
      case 'analytics': return <Analytics />
      case 'notes': return <Notes />
      case 'pomodoro': return <Pomodoro />
      case 'profile': return <Profile />
      case 'settings': return <Settings />
      default: return <Dashboard {...props} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden sm:flex">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-28 sm:pb-6">
        <TopBar onQuickAdd={() => setQuickAdd(true)} onSearch={onSearch} />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <QuickAddModal open={quickAdd} onClose={() => setQuickAdd(false)} />
      <TaskDetailModal task={detail} onClose={() => setDetail(null)} />

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-30 glass border-t-0 rounded-t-3xl px-4 py-3 flex items-center justify-around">
        {MOBILE_NAV.map((m) => (
          <button key={m.id} onClick={() => setView(m.id)} className={cx('w-12 h-12 rounded-2xl grid place-items-center transition', activeView === m.id ? 'gradient-primary text-white shadow-glow' : 'text-slate-500')}>
            <Icon name={m.icon} className="w-6 h-6" />
          </button>
        ))}
        <button onClick={() => setQuickAdd(true)} className="w-14 h-14 -mt-8 rounded-2xl gradient-primary text-white grid place-items-center shadow-glow">
          <Icon name="Plus" className="w-7 h-7" />
        </button>
      </nav>

      <AIAssistant />
      <Toasts />
      <Confetti />
    </div>
  )
}
