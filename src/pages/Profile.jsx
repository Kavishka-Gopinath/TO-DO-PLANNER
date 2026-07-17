import { motion } from 'framer-motion'
import Icon from '../components/Icon'
import ProgressRing from '../components/ProgressRing'
import { useStore } from '../store'

const ACHIEVEMENTS = [
  { icon: 'CheckCircle2', label: '100 Tasks', color: '#10B981', earned: true },
  { icon: 'Flame', label: '7-Day Streak', color: '#EF4444', earned: true },
  { icon: 'Flame', label: '30-Day Streak', color: '#F59E0B', earned: false },
  { icon: 'Timer', label: 'Focus Master', color: '#4F46E5', earned: true },
  { icon: 'Sunrise', label: 'Early Bird', color: '#F59E0B', earned: true },
  { icon: 'Moon', label: 'Night Owl', color: '#7C3AED', earned: false },
  { icon: 'Crown', label: 'Productivity King', color: '#4F46E5', earned: false },
]

export default function Profile() {
  const { user, tasks } = useStore()
  const done = tasks.filter((t) => t.status === 'completed').length
  const nextLevel = user.xp % 1000

  return (
    <div>
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass rounded-3xl p-7 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full gradient-primary opacity-20 blur-2xl" />
          <div className="relative flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl gradient-primary grid place-items-center text-white text-3xl font-extrabold shadow-glow">{user.name[0]}</div>
            <div>
              <h3 className="text-2xl font-extrabold">{user.name}</h3>
              <p className="text-slate-500">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-semibold flex items-center gap-1.5"><Icon name="Crown" className="w-4 h-4" /> Level {user.level}</span>
                <span className="px-3 py-1 rounded-lg bg-warning/10 text-warning text-sm font-semibold flex items-center gap-1.5"><Icon name="Flame" className="w-4 h-4" /> {user.streak} day streak</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1.5"><span className="text-slate-500">Level Progress</span><span className="font-semibold">{nextLevel}/1000 XP</span></div>
            <div className="h-2.5 w-full rounded-full bg-slate-200/40 dark:bg-white/10 overflow-hidden">
              <motion.div className="h-full rounded-full gradient-primary" initial={{ width: 0 }} animate={{ width: `${nextLevel / 10}%` }} transition={{ duration: 1 }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Stat icon="Target" value={user.dailyGoal} label="Daily Goal" />
            <Stat icon="CheckCircle2" value={done} label="Completed" />
            <Stat icon="Timer" value="28.5h" label="Focus Hours" />
          </div>
        </motion.div>

        <div className="glass rounded-3xl p-6">
          <h4 className="font-semibold mb-4">Achievements</h4>
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <div key={a.label} className="glass-soft rounded-2xl p-4 text-center relative">
                <div className={`w-11 h-11 rounded-xl grid place-items-center mx-auto mb-2 ${a.earned ? '' : 'opacity-40 grayscale'}`} style={a.earned ? { background: `${a.color}1a` } : {}}>
                  <Icon name={a.icon} className="w-5 h-5" style={a.earned ? { color: a.color } : {}} />
                </div>
                <p className="text-xs font-medium">{a.label}</p>
                {!a.earned && <Icon name="Lock" className="w-3.5 h-3.5 absolute top-2 right-2 text-slate-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { icon: 'CalendarCheck', label: 'Tasks Done', value: done, color: '#4F46E5' },
          { icon: 'Flame', label: 'Best Streak', value: '23', color: '#EF4444' },
          { icon: 'Clock', label: 'Hours Saved', value: '42h', color: '#10B981' },
          { icon: 'Star', label: 'XP Total', value: user.xp.toLocaleString(), color: '#F59E0B' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: `${s.color}1a` }}>
              <Icon name={s.icon} className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-extrabold">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Stat({ icon, value, label }) {
  return (
    <div className="glass-soft rounded-2xl p-4 text-center">
      <Icon name={icon} className="w-5 h-5 mx-auto text-slate-400 mb-1" />
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  )
}
