import { motion } from 'framer-motion'
import Icon from '../components/Icon'
import ProgressRing from '../components/ProgressRing'
import ProgressBar from '../components/ProgressBar'
import TaskCard from '../components/TaskCard'
import { useStore, PRIORITY_META } from '../store'
import { cx, todayISO } from '../lib/utils'

const QUOTES = [
  { text: 'Keep going. Small progress every day adds up.', author: 'Satya Nani' },
  { text: 'Productivity is never an accident. It is always the result of a commitment.', author: 'Paul J. Meyer' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
]

export default function Dashboard({ onOpenTask, onQuickAdd }) {
  const { tasks, user } = useStore()
  const today = todayISO()
  const todays = tasks.filter((t) => t.due === today)
  const completed = todays.filter((t) => t.status === 'completed').length
  const total = user.dailyGoal
  const pct = Math.round((completed / (todays.length || 1)) * 100)
  const goalPct = Math.round((completed / total) * 100)

  const pending = tasks.filter((t) => t.status === 'pending' || t.status === 'in-progress').length
  const overdue = tasks.filter((t) => (t.status === 'pending' || t.status === 'in-progress') && t.due < today).length
  const done = tasks.filter((t) => t.status === 'completed').length
  const quote = QUOTES[new Date().getDay() % QUOTES.length]

  const statCards = [
    { label: "Today's Tasks", value: todays.length, icon: 'ListTodo', color: '#4F46E5', trend: '+3' },
    { label: 'Completed', value: done, icon: 'CheckCircle2', color: '#10B981', trend: '+5' },
    { label: 'Pending', value: pending, icon: 'Clock', color: '#F59E0B', trend: '2' },
    { label: 'Overdue', value: overdue, icon: 'AlertTriangle', color: '#EF4444', trend: '1' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 relative overflow-hidden gradient-primary rounded-3xl p-7 text-white"
        >
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute bottom-0 left-10 w-32 h-32 rounded-full bg-white/10 blur-xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-white/80 font-medium mb-1">Today's Goal</p>
              <h3 className="text-3xl font-extrabold mb-1">{completed} / {total} Tasks Completed</h3>
              <div className="mt-4 max-w-xs">
                <div className="flex justify-between text-sm mb-1.5 text-white/90">
                  <span>Daily progress</span><span>{goalPct}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-white/20 overflow-hidden">
                  <motion.div className="h-full rounded-full bg-white" initial={{ width: 0 }} animate={{ width: `${goalPct}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
                </div>
              </div>
              <p className="mt-5 text-white/85 italic max-w-sm">"{quote.text}"</p>
              <p className="text-white/60 text-sm">— {quote.author}</p>
            </div>
            <ProgressRing value={pct} size={150} stroke={12}>
              <span className="text-3xl font-extrabold">{pct}%</span>
              <span className="text-xs text-white/70">Complete</span>
            </ProgressRing>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 content-start">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }} className="glass rounded-2xl p-4 hover:shadow-glass-lg transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl grid place-items-center mb-3" style={{ background: `${s.color}1a` }}>
                <Icon name={s.icon} className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
              <span className="text-[11px] font-semibold text-success mt-1 inline-block">{s.trend}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2"><Icon name="Sun" className="w-5 h-5 text-warning" /> Today's Tasks</h3>
            <button onClick={onQuickAdd} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              <Icon name="Plus" className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {todays.length ? todays.map((t) => <TaskCard key={t.id} task={t} onOpen={onOpenTask} />) : (
              <p className="text-sm text-slate-500 py-8 text-center">No tasks today. Enjoy your free time! 🎉</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold text-lg mb-4">Focus Time</h3>
            <ProgressRing value={65} size={120} stroke={10}>
              <span className="text-2xl font-extrabold">4.2h</span>
              <span className="text-[11px] text-slate-400">of 6.5h</span>
            </ProgressRing>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Productivity Score</span><span className="font-bold text-success">86</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Current Streak</span><span className="font-bold flex items-center gap-1"><Icon name="Flame" className="w-4 h-4 text-danger" /> {user.streak} days</span></div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold text-lg mb-4">Up Next</h3>
            <div className="space-y-3">
              {tasks.filter((t) => t.status !== 'completed').slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ background: PRIORITY_META[t.priority].color }} />
                  <span className="flex-1 text-sm truncate">{t.title}</span>
                  <span className="text-xs text-slate-400">{t.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
