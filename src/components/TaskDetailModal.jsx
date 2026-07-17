import { useState } from 'react'
import Modal from './Modal'
import Icon from './Icon'
import { useStore, PRIORITY_META } from '../store'
import { formatDate } from '../lib/utils'

export default function TaskDetailModal({ task, onClose }) {
  const { categoryById, updateTask, deleteTask, toggleComplete, addToast } = useStore()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([
    { id: 1, author: 'Kavishka', text: 'Started working on the layout.', time: '2h ago' },
  ])

  if (!task) return null
  const cat = categoryById(task.category)
  const pr = PRIORITY_META[task.priority]

  const toggleSub = (sid) => {
    const subtasks = task.subtasks.map((s) => (s.id === sid ? { ...s, done: !s.done } : s))
    const done = subtasks.filter((s) => s.done).length
    const progress = subtasks.length ? Math.round((done / subtasks.length) * 100) : task.progress
    updateTask(task.id, { subtasks, progress })
  }

  const addComment = () => {
    if (!comment.trim()) return
    setComments((c) => [...c, { id: Date.now(), author: 'Kavishka', text: comment, time: 'just now' }])
    setComment('')
  }

  return (
    <Modal open={!!task} onClose={onClose} title="" maxW="max-w-2xl">
      <div className="flex items-start gap-3 mb-4">
        <button
          onClick={() => toggleComplete(task.id)}
          className="w-7 h-7 rounded-lg border-2 grid place-items-center mt-1 shrink-0"
          style={{ borderColor: task.status === 'completed' ? '#10B981' : 'rgba(148,163,184,0.5)', background: task.status === 'completed' ? '#10B981' : 'transparent' }}
        >
          {task.status === 'completed' && <Icon name="Check" className="w-4 h-4 text-white" />}
        </button>
        <div className="flex-1">
          <h3 className="text-xl font-bold">{task.title}</h3>
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            {cat && (
              <span className="px-2 py-1 rounded-lg font-medium flex items-center gap-1" style={{ background: `${cat.color}1a`, color: cat.color }}>
                <Icon name={cat.icon} className="w-3.5 h-3.5" /> {cat.name}
              </span>
            )}
            <span className="px-2 py-1 rounded-lg font-semibold" style={{ background: pr.bg, color: pr.color }}>{pr.label} Priority</span>
            <span className="px-2 py-1 rounded-lg bg-slate-500/10 text-slate-500 dark:text-slate-300 capitalize">{task.status.replace('-', ' ')}</span>
          </div>
        </div>
        <button onClick={() => { deleteTask(task.id); addToast('Task deleted'); onClose() }} className="text-slate-400 hover:text-danger p-2">
          <Icon name="Trash2" className="w-5 h-5" />
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{task.description}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-sm">
        <Meta icon="Calendar" label="Deadline" value={formatDate(task.due)} />
        <Meta icon="Clock" label="Time" value={task.time} />
        <Meta icon="Timer" label="Est." value={`${task.duration}h`} />
        <Meta icon="Repeat" label="Repeat" value={task.repeat} />
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold">Progress</span>
          <span>{task.progress}%</span>
        </div>
        <input type="range" min="0" max="100" step="5" value={task.progress}
          onChange={(e) => updateTask(task.id, { progress: Number(e.target.value) })}
          className="w-full accent-primary" />
      </div>

      {task.subtasks?.length > 0 && (
        <div className="mb-5">
          <p className="text-sm font-semibold mb-2">Checklist</p>
          <div className="space-y-2">
            {task.subtasks.map((s) => (
              <label key={s.id} className="flex items-center gap-3 p-3 rounded-xl glass-soft cursor-pointer">
                <input type="checkbox" checked={s.done} onChange={() => toggleSub(s.id)} className="accent-primary w-4 h-4" />
                <span className={s.done ? 'line-through opacity-60 text-sm' : 'text-sm'}>{s.title}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {task.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">#{t}</span>
          ))}
        </div>
      )}

      <div className="glass-soft rounded-xl p-3 mb-5">
        <p className="text-sm font-semibold mb-3 flex items-center gap-2"><Icon name="History" className="w-4 h-4" /> Activity</p>
        <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex gap-2"><Icon name="PlusCircle" className="w-4 h-4 text-primary shrink-0" /> Task created</div>
          <div className="flex gap-2"><Icon name="Bell" className="w-4 h-4 text-warning shrink-0" /> Reminder set for {task.time}</div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Comments</p>
        <div className="space-y-2 mb-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full gradient-primary grid place-items-center text-white text-xs font-semibold shrink-0">{c.author[0]}</div>
              <div className="glass-soft rounded-xl px-3 py-2 flex-1">
                <p className="text-xs"><span className="font-semibold">{c.author}</span> · <span className="text-slate-400">{c.time}</span></p>
                <p className="text-sm">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." className="flex-1 px-3 py-2.5 rounded-xl glass-soft outline-none text-sm" />
          <button onClick={addComment} className="px-4 gradient-primary text-white rounded-xl hover:opacity-90 transition"><Icon name="Send" className="w-4 h-4" /></button>
        </div>
      </div>
    </Modal>
  )
}

function Meta({ icon, label, value }) {
  return (
    <div className="glass-soft rounded-xl p-3">
      <p className="text-[11px] text-slate-400 flex items-center gap-1 mb-1"><Icon name={icon} className="w-3.5 h-3.5" /> {label}</p>
      <p className="font-semibold capitalize truncate">{value || '—'}</p>
    </div>
  )
}
