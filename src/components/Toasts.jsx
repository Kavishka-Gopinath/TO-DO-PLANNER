import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icon'
import { useStore } from '../store'

const ICON = { success: 'CheckCircle2', error: 'AlertCircle', info: 'Info' }
const COLOR = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-primary',
}

export default function Toasts() {
  const toasts = useStore((s) => s.toasts)
  const removeToast = useStore((s) => s.removeToast)
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 items-end">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            className="glass px-4 py-3 rounded-xl flex items-center gap-3 shadow-glass-lg min-w-[220px]"
          >
            <Icon name={ICON[t.type] || 'Info'} className={`w-5 h-5 ${COLOR[t.type] || COLOR.info}`} />
            <span className="text-sm font-medium flex-1">{t.msg}</span>
            <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-600">
              <Icon name="X" className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
