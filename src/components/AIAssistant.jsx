import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../components/Icon'
import { useStore } from '../store'
import { todayISO } from '../lib/utils'

const SUGGESTIONS = [
  'Break "Launch marketing campaign" into subtasks',
  'Plan my study schedule for finals',
  'Prioritize my tasks for today',
]

function parseInput(text) {
  const dateMap = {
    today: todayISO(),
    tomorrow: (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10) })(),
    friday: null, monday: null,
  }
  const lower = text.toLowerCase()
  let due = todayISO()
  if (lower.includes('tomorrow')) due = dateMap.tomorrow
  else if (lower.includes('friday')) { const d = new Date(); d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7)); due = d.toISOString().slice(0, 10) }
  const high = /urgent|before friday|asap|important/.test(lower)
  const parts = text.split(/\band|\bthen\b|,|\./).map((s) => s.trim()).filter(Boolean)
  return parts.map((p) => ({
    title: p.replace(/^(i need to|i should|finish|complete|do|prepare|plan|launch|build)\s*/i, '').replace(/^my\s*/i, '').replace(/\b(before|by)\s+\w+/gi, '').trim().replace(/\s+/g, ' '),
    due,
    priority: high ? 'high' : 'medium',
    category: lower.includes('exam') || lower.includes('study') ? 'cat-college' : 'cat-work',
  })).filter((t) => t.title.length > 1)
}

export default function AIAssistant() {
  const { aiOpen, setAI, addTask, addToast } = useStore()
  const [input, setInput] = useState('')
  const [log, setLog] = useState([
    { from: 'ai', text: "Hi Kavishka! 👋 I can break tasks into subtasks, suggest deadlines, and plan your day. Try the examples below." },
  ])

  const send = (text) => {
    text = (text || input).trim()
    if (!text) return
    setLog((l) => [...l, { from: 'me', text }])
    setInput('')
    const tasks = parseInput(text)
    if (tasks.length) {
      tasks.forEach((t, i) => setTimeout(() => {
        addTask({ ...t, description: 'Created by AI Assistant' })
        if (i === tasks.length - 1) addToast(`AI created ${tasks.length} task${tasks.length > 1 ? 's' : ''}`, 'success')
      }, i * 250))
      setLog((l) => [...l, { from: 'ai', text: `✅ I created ${tasks.length} task(s) with smart deadlines & priorities. Check your list!` }])
    } else {
      setLog((l) => [...l, { from: 'ai', text: 'Got it. Tell me what you need to do and I\'ll turn it into actionable tasks.' }])
    }
  }

  const breakTask = () => {
    addTask({ title: 'Launch marketing campaign', category: 'cat-work', priority: 'high', due: todayISO(), subtasks: [
      { id: 'x1', title: 'Define target audience', done: false },
      { id: 'x2', title: 'Write ad copy', done: false },
      { id: 'x3', title: 'Design creatives', done: false },
      { id: 'x4', title: 'Schedule posts', done: false },
    ], progress: 0 })
    addToast('AI broke task into 4 subtasks', 'success')
    setLog((l) => [...l, { from: 'ai', text: '🔨 Broke "Launch marketing campaign" into 4 subtasks.' }])
  }

  return (
    <>
      <button
        onClick={() => setAI(!aiOpen)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-2xl gradient-primary text-white grid place-items-center shadow-glow hover:scale-110 transition"
        aria-label="AI Assistant"
      >
        <Icon name="Sparkles" className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {aiOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-44 right-6 z-40 w-[min(92vw,360px)] glass rounded-3xl shadow-glass-lg overflow-hidden"
          >
            <div className="gradient-primary p-4 flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-xl bg-white/20 grid place-items-center"><Icon name="Sparkles" className="w-5 h-5" /></div>
              <div>
                <p className="font-bold">TaskFlow AI</p>
                <p className="text-xs text-white/80">Your productivity copilot</p>
              </div>
            </div>

            <div className="p-4 h-72 overflow-y-auto space-y-3">
              {log.map((m, i) => (
                <div key={i} className={m.from === 'me' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.from === 'me' ? 'gradient-primary text-white rounded-br-sm' : 'glass-soft rounded-bl-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <button onClick={breakTask} className="w-full text-left text-xs px-3 py-2 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20 transition">
                ✨ Break a task into subtasks
              </button>
            </div>

            <div className="p-3 border-t border-[var(--border)] space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="text-[11px] px-2 py-1 rounded-lg bg-slate-500/10 text-slate-500 dark:text-slate-300 hover:bg-slate-500/20">{s}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Ask anything..." className="flex-1 px-3 py-2.5 rounded-xl glass-soft text-sm outline-none" />
                <button onClick={() => send()} className="px-3 gradient-primary text-white rounded-xl"><Icon name="Send" className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
