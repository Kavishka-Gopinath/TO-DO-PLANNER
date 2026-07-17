import { motion } from 'framer-motion'
import Icon from '../components/Icon'
import ProgressBar from '../components/ProgressBar'
import { useStore } from '../store'

export default function Categories({ onQuickAdd }) {
  const { categories, tasks } = useStore()
  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Categories</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((c, i) => {
          const ct = tasks.filter((t) => t.category === c.id)
          const done = ct.filter((t) => t.status === 'completed').length
          const pct = ct.length ? Math.round((done / ct.length) * 100) : 0
          return (
            <motion.div
              key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -6 }} className="glass rounded-3xl p-5 cursor-pointer hover:shadow-glass-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl grid place-items-center mb-4" style={{ background: `${c.color}1a` }}>
                <Icon name={c.icon} className="w-6 h-6" style={{ color: c.color }} />
              </div>
              <h4 className="font-bold text-lg">{c.name}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{ct.length} tasks</p>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400">Completed</span>
                <span className="font-semibold">{pct}%</span>
              </div>
              <ProgressBar value={pct} color={c.color} />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
