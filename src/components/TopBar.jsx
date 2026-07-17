import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icon'
import { useStore } from '../store'
import { greeting } from '../lib/utils'

export default function TopBar({ onQuickAdd, onSearch }) {
  const { user, tasks } = useStore()
  const [q, setQ] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const todayCount = tasks.filter((t) => t.due === new Date().toISOString().slice(0, 10)).length

  const notifications = [
    { icon: 'Clock', color: '#F59E0B', text: 'Prepare exam notes due today at 6:30 PM' },
    { icon: 'CalendarCheck', color: '#4F46E5', text: 'Team standup completed — nice!' },
    { icon: 'Flame', color: '#EF4444', text: '7-day streak! Keep it going 🔥' },
    { icon: 'Award', color: '#10B981', text: 'Achievement unlocked: Early Bird' },
  ]

  return (
    <header className="glass sticky top-0 z-20 rounded-none sm:rounded-2xl p-4 mb-6 flex items-center gap-4">
      <div className="hidden sm:block min-w-0">
        <h2 className="font-bold text-xl leading-tight">
          {greeting()}, {user.name} <span className="inline-block animate-wave">👋</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {date} · <span className="text-primary font-semibold">{todayCount} tasks today</span>
        </p>
      </div>

      <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <Icon name="Search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              onSearch?.(e.target.value)
            }}
            placeholder="Search tasks..."
            className="w-56 lg:w-72 pl-9 pr-3 py-2.5 rounded-xl glass-soft text-sm outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </div>

        <div className="hidden lg:flex items-center gap-2 glass-soft px-3 py-2 rounded-xl text-sm">
          <Icon name="CloudSun" className="w-4 h-4 text-warning" />
          <span className="text-slate-600 dark:text-slate-300">28°C</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="w-11 h-11 rounded-xl glass-soft grid place-items-center hover:scale-105 transition relative"
            aria-label="Notifications"
          >
            <Icon name="Bell" className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger animate-pulse" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                className="glass absolute right-0 mt-2 w-72 rounded-2xl p-2 shadow-glass-lg z-30"
              >
                <p className="px-3 py-2 text-sm font-semibold">Notifications</p>
                {notifications.map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-500/10 transition">
                    <div className="w-8 h-8 rounded-lg grid place-items-center shrink-0" style={{ background: `${n.color}1a` }}>
                      <Icon name={n.icon} className="w-4 h-4" style={{ color: n.color }} />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{n.text}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onQuickAdd}
          className="w-11 h-11 rounded-xl gradient-primary grid place-items-center text-white shadow-glow hover:scale-105 transition"
          aria-label="Quick add task"
        >
          <Icon name="Plus" className="w-6 h-6" />
        </button>
      </div>
    </header>
  )
}
