import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Icon from '../components/Icon'
import ProgressRing from '../components/ProgressRing'
import { useStore } from '../store'

const MODES = [
  { id: 'focus', label: 'Focus', min: 25, color: '#4F46E5' },
  { id: 'short', label: 'Short Break', min: 5, color: '#10B981' },
  { id: 'long', label: 'Long Break', min: 15, color: '#7C3AED' },
]
const NOISE = ['None', 'White Noise', 'Rain', 'Lo-Fi']

export default function Pomodoro() {
  const addToast = useStore((s) => s.addToast)
  const [mode, setMode] = useState('focus')
  const [secs, setSecs] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(4)
  const [noise, setNoise] = useState('None')
  const ref = useRef(null)

  const total = MODES.find((m) => m.id === mode).min * 60

  useEffect(() => {
    if (!running) return
    ref.current = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) {
          clearInterval(ref.current)
          setRunning(false)
          addToast(`${MODES.find((m) => m.id === mode).label} complete!`, 'success')
          if (mode === 'focus') setSessions((n) => n + 1)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [running, mode])

  const selectMode = (m) => {
    setMode(m.id)
    setSecs(m.min * 60)
    setRunning(false)
  }

  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Pomodoro Timer</h3>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-3xl p-8 flex flex-col items-center">
          <div className="flex gap-2 mb-8">
            {MODES.map((m) => (
              <button key={m.id} onClick={() => selectMode(m)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${mode === m.id ? 'text-white' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-500/10'}`} style={mode === m.id ? { background: m.color } : {}}>
                {m.label}
              </button>
            ))}
          </div>

          <ProgressRing value={Math.round(((total - secs) / total) * 100)} size={260} stroke={14}>
            <span className="text-6xl font-extrabold tabular-nums">{mm}:{ss}</span>
            <span className="text-sm text-slate-400 mt-1">{MODES.find((m) => m.id === mode).label}</span>
          </ProgressRing>

          <div className="flex items-center gap-4 mt-8">
            <button onClick={() => setRunning((r) => !r)} className="w-16 h-16 rounded-full gradient-primary text-white grid place-items-center shadow-glow hover:scale-105 transition">
              <Icon name={running ? 'Pause' : 'Play'} className="w-7 h-7" />
            </button>
            <button onClick={() => { setSecs(total); setRunning(false) }} className="w-14 h-14 rounded-full glass-soft grid place-items-center hover:bg-slate-500/10 transition">
              <Icon name="RotateCcw" className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <Icon name="Music" className="w-4 h-4 text-slate-400" />
            {NOISE.map((n) => (
              <button key={n} onClick={() => setNoise(n)} className={`text-xs px-3 py-1.5 rounded-lg transition ${noise === n ? 'bg-primary/15 text-primary font-medium' : 'text-slate-500 hover:bg-slate-500/10'}`}>{n}</button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Today's Sessions", value: sessions, icon: 'CheckCircle2', color: '#10B981' },
            { label: 'Focus Hours', value: '2.1h', icon: 'Timer', color: '#4F46E5' },
            { label: 'Weekly Total', value: '18.5h', icon: 'BarChart3', color: '#7C3AED' },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl grid place-items-center" style={{ background: `${s.color}1a` }}>
                <Icon name={s.icon} className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
