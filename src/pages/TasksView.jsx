import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import TaskCard from '../components/TaskCard'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import { useStore, PRIORITY_META } from '../store'
import { cx, todayISO } from '../lib/utils'

export default function TasksView({ scope, onOpenTask, onQuickAdd, query }) {
  const { tasks, categories } = useStore()
  const today = todayISO()
  const [priority, setPriority] = useState('all')
  const [status, setStatus] = useState('all')
  const [cat, setCat] = useState('all')
  const [sort, setSort] = useState('deadline')
  const [q, setQ] = useState('')

  useEffect(() => { if (query !== undefined) setQ(query) }, [query])

  const list = useMemo(() => {
    let r = tasks.filter((t) => {
      if (scope === 'today') return t.due === today
      return t.due > today
    })
    if (priority !== 'all') r = r.filter((t) => t.priority === priority)
    if (status !== 'all') r = r.filter((t) => t.status === status)
    if (cat !== 'all') r = r.filter((t) => t.category === cat)
    if (q) r = r.filter((t) => (t.title + t.description).toLowerCase().includes(q.toLowerCase()))
    r = [...r].sort((a, b) => {
      if (sort === 'deadline') return a.due.localeCompare(b.due)
      if (sort === 'priority') return Object.keys(PRIORITY_META).indexOf(a.priority) - Object.keys(PRIORITY_META).indexOf(b.priority)
      if (sort === 'alphabetical') return a.title.localeCompare(b.title)
      return 0
    })
    return r
  }, [tasks, scope, priority, status, cat, sort, q, today])

  const counts = {
    all: tasks.length,
    high: list.filter((t) => t.priority === 'high').length,
  }

  return (
    <div>
      <div className="glass rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Icon name="Search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter tasks..." className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-soft text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <Select label="Priority" value={priority} onChange={setPriority} options={[['all', 'All'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']]} />
        <Select label="Status" value={status} onChange={setStatus} options={[['all', 'All'], ['pending', 'Pending'], ['in-progress', 'In Progress'], ['completed', 'Completed']]} />
        <Select label="Category" value={cat} onChange={setCat} options={[['all', 'All'], ...categories.map((c) => [c.id, c.name])]} />
        <Select label="Sort" value={sort} onChange={setSort} options={[['deadline', 'Deadline'], ['priority', 'Priority'], ['alphabetical', 'A-Z']]} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">{scope === 'today' ? "Today's Tasks" : 'Upcoming'}</h3>
        <span className="text-sm text-slate-500">{list.length} tasks</span>
      </div>

      {list.length ? (
        <div className="grid md:grid-cols-2 gap-3">
          {list.map((t) => <TaskCard key={t.id} task={t} onOpen={onOpenTask} />)}
        </div>
      ) : (
        <div className="glass rounded-3xl">
          <EmptyState icon="PartyPopper" title={scope === 'today' ? 'No Tasks Today' : 'Nothing Upcoming'} message="Enjoy your free time!" actionLabel="Create New Task" onAction={onQuickAdd} />
        </div>
      )}
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-slate-500 hidden sm:inline">{label}:</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="px-3 py-2.5 rounded-xl glass-soft outline-none text-sm">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  )
}
