import { motion } from 'framer-motion'
import Icon from './Icon'
import { useStore } from '../store'
import { cx } from '../lib/utils'

export default function Sidebar() {
  const {
    navItems, activeView, setView, sidebarCollapsed, toggleSidebar,
    darkMode, toggleDark, user, logout,
  } = useStore()

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 78 : 264 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="glass relative z-30 h-full flex flex-col rounded-none sm:rounded-r-3xl border-y-0 border-l-0 p-3 shrink-0"
    >
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="w-10 h-10 rounded-2xl gradient-primary grid place-items-center shadow-glow shrink-0">
          <Icon name="CheckCheck" className="w-6 h-6 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-lg leading-none">TaskFlow</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Productivity OS</p>
          </div>
        )}
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full glass grid place-items-center shadow-glass hover:scale-110 transition"
        aria-label="Toggle sidebar"
      >
        <Icon name={sidebarCollapsed ? 'ChevronRight' : 'ChevronLeft'} className="w-4 h-4" />
      </button>

      <nav className="flex-1 mt-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition relative group',
                active ? 'text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-500/10',
              )}
              title={item.label}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl gradient-primary shadow-glow"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon name={item.icon} className="w-5 h-5 relative z-10 shrink-0" />
              {!sidebarCollapsed && <span className="relative z-10 truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="space-y-2 pt-3 border-t border-[var(--border)]">
        <button
          onClick={toggleDark}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-500/10 transition"
          title="Toggle theme"
        >
          <Icon name={darkMode ? 'Sun' : 'Moon'} className="w-5 h-5" />
          {!sidebarCollapsed && <span>Dark Mode</span>}
        </button>

        {!sidebarCollapsed && (
          <div className="glass-soft rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-300">
              <Icon name="CloudCheck" className="w-4 h-4 text-success" />
              Synced
            </div>
            <span className="text-slate-400">2.4 GB</span>
          </div>
        )}

        <div className={cx('flex items-center gap-3 px-2 py-2', sidebarCollapsed && 'justify-center')}>
          <div className="w-9 h-9 rounded-full gradient-primary grid place-items-center text-white font-semibold shrink-0">
            {user.name[0]}
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-danger/10 hover:text-danger transition"
          title="Logout"
        >
          <Icon name="LogOut" className="w-5 h-5" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  )
}
