import { useState } from 'react'
import { motion } from 'framer-motion'
import Icon from '../components/Icon'
import { useStore, PRIORITY_META } from '../store'
import { cx, monthMatrix, MONTHS, WEEKDAYS, todayISO, formatDate } from '../lib/utils'

export default function Calendar({ onOpenTask }) {
  const { tasks, categoryById } = useStore()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const cells = monthMatrix(year, month)
  const today = todayISO()

  const byDate = (iso) => tasks.filter((t) => t.due === iso)
  const shift = (d) => {
    const m = month + d
    setMonth((m + 12) % 12)
    setYear(year + Math.floor(m / 12))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2"><Icon name="CalendarDays" className="w-5 h-5 text-primary" /> Calendar</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => shift(-1)} className="w-9 h-9 rounded-xl glass-soft grid place-items-center hover:bg-slate-500/10"><Icon name="ChevronLeft" className="w-4 h-4" /></button>
          <span className="font-semibold min-w-[140px] text-center">{MONTHS[month]} {year}</span>
          <button onClick={() => shift(1)} className="w-9 h-9 rounded-xl glass-soft grid place-items-center hover:bg-slate-500/10"><Icon name="ChevronRight" className="w-4 h-4" /></button>
          <button onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()) }} className="ml-2 px-3 py-2 rounded-xl glass-soft text-sm hover:bg-slate-500/10">Today</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass rounded-3xl p-4 overflow-hidden">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((w) => <div key={w} className="text-center text-xs font-semibold text-slate-400 py-2">{w}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={i} />
              const iso = date.toISOString().slice(0, 10)
              const dayTasks = byDate(iso)
              const isToday = iso === today
              return (
                <div key={i} className={cx('min-h-[92px] rounded-xl p-2 border transition', isToday ? 'border-primary bg-primary/5' : 'border-[var(--border)] hover:bg-slate-500/5')}>
                  <div className={cx('text-xs font-semibold w-6 h-6 grid place-items-center rounded-full mb-1', isToday ? 'bg-primary text-white' : 'text-slate-500')}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((t) => {
                      const cat = categoryById(t.category)
                      return (
                        <button key={t.id} onClick={() => onOpenTask(t)} className="w-full text-left truncate text-[10px] px-1.5 py-1 rounded-md flex items-center gap-1" style={{ background: `${cat?.color || '#4F46E5'}22`, color: cat?.color || '#4F46E5' }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: PRIORITY_META[t.priority].color }} />
                          <span className="truncate">{t.title}</span>
                        </button>
                      )
                    })}
                    {dayTasks.length > 3 && <p className="text-[10px] text-slate-400 pl-1">+{dayTasks.length - 3} more</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-3xl p-5">
            <h4 className="font-semibold mb-3">Upcoming Deadlines</h4>
            <div className="space-y-3">
              {tasks.filter((t) => t.due >= today && t.status !== 'completed').sort((a, b) => a.due.localeCompare(b.due)).slice(0, 5).map((t) => {
                const cat = categoryById(t.category)
                return (
                  <button key={t.id} onClick={() => onOpenTask(t)} className="w-full flex items-center gap-3 text-left">
                    <div className="w-10 text-center shrink-0">
                      <p className="text-sm font-bold">{formatDate(t.due).split(' ')[1]}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(t.due).split(' ')[0]}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.title}</p>
                      <p className="text-xs" style={{ color: cat?.color }}>{cat?.name}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
