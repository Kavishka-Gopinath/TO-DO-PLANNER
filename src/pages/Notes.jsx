import { useState } from 'react'
import { motion } from 'framer-motion'
import Icon from '../components/Icon'
import Modal from '../components/Modal'
import { useStore } from '../store'

export default function Notes() {
  const { notes, addNote, deleteNote } = useStore()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [folder, setFolder] = useState('Personal')

  const folders = [...new Set(notes.map((n) => n.folder))]

  const save = () => {
    if (!title.trim()) return
    addNote({ title, body, folder })
    setTitle(''); setBody(''); setOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Notes</h3>
        <button onClick={() => setOpen(true)} className="px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-medium shadow-glow hover:opacity-90 flex items-center gap-2">
          <Icon name="Plus" className="w-4 h-4" /> New Note
        </button>
      </div>

      {folders.map((f) => (
        <div key={f} className="mb-6">
          <p className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-3"><Icon name="Folder" className="w-4 h-4" /> {f}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.filter((n) => n.folder === f).map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }} className="glass rounded-2xl p-4 hover:shadow-glass-lg transition-shadow relative group"
              >
                {n.pinned && <Icon name="Pin" className="w-4 h-4 text-warning absolute top-4 right-4" />}
                <h4 className="font-semibold mb-2 pr-6">{n.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-line line-clamp-4">{n.body}</p>
                <button onClick={() => deleteNote(n.id)} className="absolute bottom-3 right-3 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-danger transition"><Icon name="Trash2" className="w-4 h-4" /></button>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      <Modal open={open} onClose={() => setOpen(false)} title="New Note">
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" className="w-full px-4 py-3 rounded-xl glass-soft outline-none focus:ring-2 focus:ring-primary/40" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="Write something..." className="w-full px-4 py-3 rounded-xl glass-soft outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          <input value={folder} onChange={(e) => setFolder(e.target.value)} placeholder="Folder" className="w-full px-4 py-3 rounded-xl glass-soft outline-none focus:ring-2 focus:ring-primary/40" />
          <div className="flex gap-3 pt-1">
            <button onClick={() => setOpen(false)} className="flex-1 py-3 rounded-xl glass-soft font-medium">Cancel</button>
            <button onClick={save} className="flex-1 py-3 rounded-xl gradient-primary text-white font-semibold shadow-glow">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
