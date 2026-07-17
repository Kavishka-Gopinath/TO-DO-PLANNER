import { useState } from 'react'
import { DndContext, useDraggable, useDroppable, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import Icon from '../components/Icon'
import { useStore, STATUS_COLUMNS, PRIORITY_META } from '../store'

function Card({ task, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })
  const cat = useStore((s) => s.categoryById)(task.category)
  const deleteTask = useStore((s) => s.deleteTask)
  const addToast = useStore((s) => s.addToast)
  const pr = PRIORITY_META[task.priority]
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 } : undefined
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onOpen(task)}
      className={`group relative glass rounded-xl p-3 cursor-grab active:cursor-grabbing mb-3 ${isDragging ? 'opacity-80 shadow-glass-lg' : ''}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (window.confirm(`Delete "${task.title}"?`)) {
            deleteTask(task.id)
            addToast('Task deleted', 'success')
          }
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg grid place-items-center text-slate-400 hover:text-danger hover:bg-danger/10 transition z-10"
        aria-label="Delete task"
        title="Delete"
      >
        <Icon name="Trash2" className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: pr.color }} />
        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded" style={{ background: pr.bg, color: pr.color }}>{pr.label}</span>
      </div>
      <p className="font-semibold text-sm leading-snug mb-2">{task.title}</p>
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1"><Icon name="Clock" className="w-3 h-3" /> {task.time}</span>
        <div className="flex items-center gap-2">
          {task.tags?.length > 0 && <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">#{task.tags[0]}</span>}
          <div className="w-6 h-6 rounded-full gradient-primary grid place-items-center text-white text-[10px] font-semibold">{task.assignee?.[0]}</div>
        </div>
      </div>
      {task.subtasks?.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Icon name="ListChecks" className="w-3 h-3" />
          {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length}
        </div>
      )}
    </div>
  )
}

function Column({ col, children, count }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id })
  return (
    <div ref={setNodeRef} className={`flex flex-col min-w-0 flex-1 rounded-2xl p-3 transition ${isOver ? 'bg-primary/10' : 'bg-slate-500/5'}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <h4 className="font-semibold text-sm">{col.label}</h4>
        <span className="text-xs text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full">{count}</span>
      </div>
      <div className="flex-1 space-y-0">{children}</div>
    </div>
  )
}

export default function Kanban({ onOpenTask }) {
  const { tasks, moveTask } = useStore()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const [active, setActive] = useState(null)

  const onDragEnd = (e) => {
    setActive(null)
    const { active, over } = e
    if (over && STATUS_COLUMNS.find((c) => c.id === over.id)) {
      moveTask(active.id, over.id)
    }
  }

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Kanban Board</h3>
      <DndContext sensors={sensors} onDragStart={(e) => setActive(e.active.id)} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id)
            return (
              <Column key={col.id} col={col} count={colTasks.length}>
                {colTasks.map((t) => <Card key={t.id} task={t} onOpen={onOpenTask} />)}
              </Column>
            )
          })}
        </div>
      </DndContext>
    </div>
  )
}
