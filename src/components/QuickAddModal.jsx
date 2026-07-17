import { useState } from 'react'
import { useStore, PRIORITY_META } from '../store'
import Modal from './Modal'
import Icon from './Icon'
import { todayISO } from '../lib/utils'

let sid = 0
const newSub = () => ({ id: `s${++sid}`, title: '', done: false })

export default function QuickAddModal({ open, onClose }) {
  const { categories, addTask, addToast } = useStore()
  const [form, setForm] = useState({
    title: '', description: '', category: 'cat-work', priority: 'medium',
    due: todayISO(), time: '12:00', duration: 1, repeat: 'none', reminder: false, attachment: false, tags: '',
  })
  const [subtasks, setSubtasks] = useState([])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const reset = () => {
    setForm({ title: '', description: '', category: 'cat-work', priority: 'medium', due: todayISO(), time: '12:00', duration: 1, repeat: 'none', reminder: false, attachment: false, tags: '' })
    setSubtasks([])
  }

  const save = () => {
    if (!form.title.trim()) {
      addToast('Task name is required', 'error')
      return
    }
    addTask({
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      subtasks: subtasks.filter((s) => s.title.trim()).map((s) => ({ ...s, id: `s${++sid}` })),
    })
    addToast('Task created', 'success')
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Quick Add Task">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Task Name</label>
          <input
            autoFocus
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Finish React Dashboard"
            className="w-full px-4 py-3 rounded-xl glass-soft outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl glass-soft outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full px-3 py-3 rounded-xl glass-soft outline-none">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Priority</label>
            <div className="flex gap-1.5">
              {Object.entries(PRIORITY_META).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => set('priority', k)}
                  className="flex-1 py-3 rounded-xl text-xs font-semibold transition"
                  style={{ background: form.priority === k ? v.bg : 'transparent', color: form.priority === k ? v.color : 'var(--text-muted)', border: '1px solid var(--border)' }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Deadline</label>
            <input type="date" value={form.due} onChange={(e) => set('due', e.target.value)} className="w-full px-3 py-3 rounded-xl glass-soft outline-none text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Time</label>
            <input type="time" value={form.time} onChange={(e) => set('time', e.target.value)} className="w-full px-3 py-3 rounded-xl glass-soft outline-none text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Est. (h)</label>
            <input type="number" min="1" value={form.duration} onChange={(e) => set('duration', Number(e.target.value))} className="w-full px-3 py-3 rounded-xl glass-soft outline-none text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Tags (comma sep)</label>
            <input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="React, UI" className="w-full px-3 py-3 rounded-xl glass-soft outline-none text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Repeat</label>
            <select value={form.repeat} onChange={(e) => set('repeat', e.target.value)} className="w-full px-3 py-3 rounded-xl glass-soft outline-none">
              {['none', 'daily', 'weekly', 'weekdays', 'monthly'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Subtasks</label>
          <div className="space-y-2">
            {subtasks.map((s, i) => (
              <div key={s.id} className="flex gap-2">
                <input value={s.title} onChange={(e) => setSubtasks((arr) => arr.map((x) => x.id === s.id ? { ...x, title: e.target.value } : x))} placeholder="Subtask" className="flex-1 px-3 py-2 rounded-lg glass-soft outline-none text-sm" />
                <button onClick={() => setSubtasks((arr) => arr.filter((x) => x.id !== s.id))} className="px-2 text-slate-400 hover:text-danger"><Icon name="Trash2" className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => setSubtasks((a) => [...a, newSub()])} className="text-sm text-primary font-medium flex items-center gap-1.5">
              <Icon name="Plus" className="w-4 h-4" /> Add subtask
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.reminder} onChange={(e) => set('reminder', e.target.checked)} className="accent-primary w-4 h-4" />
            <Icon name="Bell" className="w-4 h-4" /> Reminder
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.attachment} onChange={(e) => set('attachment', e.target.checked)} className="accent-primary w-4 h-4" />
            <Icon name="Paperclip" className="w-4 h-4" /> Attachment
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl glass-soft font-medium hover:bg-slate-500/10 transition">Cancel</button>
          <button onClick={save} className="flex-1 py-3 rounded-xl gradient-primary text-white font-semibold shadow-glow hover:opacity-90 transition flex items-center justify-center gap-2">
            <Icon name="Save" className="w-4 h-4" /> Save Task
          </button>
        </div>
      </div>
    </Modal>
  )
}
