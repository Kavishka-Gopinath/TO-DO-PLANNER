import { motion } from 'framer-motion'
import Icon from './Icon'
import { PRIORITY_META } from '../store'
import { useStore } from '../store'
import { formatDate, isOverdue } from '../lib/utils'

function Avatar({ name, size = 'w-7 h-7 text-xs' }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <div className={`${size} rounded-full gradient-primary grid place-items-center text-white font-semibold`}>
      {initials}
    </div>
  )
}

export default function TaskCard({ task, onOpen, compact = false }) {
  const categoryById = useStore((s) => s.categoryById)
  const toggleComplete = useStore((s) => s.toggleComplete)
  const deleteTask = useStore((s) => s.deleteTask)
  const addToast = useStore((s) => s.addToast)
  const cat = categoryById(task.category)
  const pr = PRIORITY_META[task.priority]
  const overdue = !['completed'].includes(task.status) && isOverdue(task.due)

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onClick={() => onOpen?.(task)}
      className="glass rounded-2xl p-4 cursor-pointer group hover:shadow-glass-lg transition-shadow"
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleComplete(task.id)
          }}
          className="mt-0.5 w-6 h-6 rounded-lg border-2 grid place-items-center transition shrink-0"
          style={{ borderColor: task.status === 'completed' ? '#10B981' : 'rgba(148,163,184,0.5)', background: task.status === 'completed' ? '#10B981' : 'transparent' }}
          aria-label="Toggle complete"
        >
          {task.status === 'completed' && <Icon name="Check" className="w-3.5 h-3.5 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: pr.color }} />
            <h4 className={`font-semibold truncate ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
              {task.title}
            </h4>
          </div>
          {!compact && task.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {cat && (
              <span className="px-2 py-1 rounded-lg font-medium flex items-center gap-1" style={{ background: `${cat.color}1a`, color: cat.color }}>
                <Icon name={cat.icon} className="w-3.5 h-3.5" />
                {cat.name}
              </span>
            )}
            {task.time && (
              <span className={`px-2 py-1 rounded-lg flex items-center gap-1 ${overdue ? 'bg-danger/10 text-danger' : 'bg-slate-500/10 text-slate-500 dark:text-slate-300'}`}>
                <Icon name="Clock" className="w-3.5 h-3.5" />
                {task.time}
              </span>
            )}
            {task.duration ? (
              <span className="px-2 py-1 rounded-lg bg-slate-500/10 text-slate-500 dark:text-slate-300 flex items-center gap-1">
                <Icon name="Timer" className="w-3.5 h-3.5" />
                {task.duration}h
              </span>
            ) : null}
            {task.reminder && <Icon name="Bell" className="w-3.5 h-3.5 text-warning" />}
            {task.repeat !== 'none' && <Icon name="Repeat" className="w-3.5 h-3.5 text-slate-400" />}
            {task.attachment && <Icon name="Paperclip" className="w-3.5 h-3.5 text-slate-400" />}
          </div>

          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {task.tags.map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {task.progress > 0 && task.progress < 100 && (
            <div className="mt-3">
              <div className="h-1.5 w-full rounded-full bg-slate-200/40 dark:bg-white/10 overflow-hidden">
                <div className="h-full rounded-full gradient-primary" style={{ width: `${task.progress}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (window.confirm(`Delete "${task.title}"?`)) {
                deleteTask(task.id)
                addToast('Task deleted', 'success')
              }
            }}
            className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg grid place-items-center text-slate-400 hover:text-danger hover:bg-danger/10 transition"
            aria-label="Delete task"
            title="Delete"
          >
            <Icon name="Trash2" className="w-4 h-4" />
          </button>
          {task.assignee && <Avatar name={task.assignee} />}
          <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-md" style={{ background: pr.bg, color: pr.color }}>
            {pr.label}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
