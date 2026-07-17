import { useState } from 'react'
import { motion } from 'framer-motion'
import Icon from './Icon'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('kavishka@taskflow.app')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      onLogin(email)
      setLoading(false)
    }, 700)
  }

  return (
    <div className="min-h-screen w-full grid place-items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="glass w-full max-w-md rounded-3xl p-8 shadow-glass-lg"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-3xl gradient-primary grid place-items-center shadow-glow mb-4 animate-float">
            <Icon name="CheckCheck" className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold">TaskFlow</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your productivity OS</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Email</label>
            <div className="relative">
              <Icon name="Mail" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-9 pr-3 py-3 rounded-xl glass-soft outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Password</label>
            <div className="relative">
              <Icon name="Lock" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-9 pr-3 py-3 rounded-xl glass-soft outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl gradient-primary text-white font-semibold shadow-glow hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? <Icon name="Loader2" className="w-5 h-5 animate-spin" /> : <Icon name="LogIn" className="w-5 h-5" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5 text-xs text-slate-400">
          <div className="flex-1 h-px bg-[var(--border)]" /> or <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <button onClick={() => onLogin(email)} className="w-full py-3 rounded-xl glass-soft font-medium hover:bg-slate-500/10 transition flex items-center justify-center gap-2">
          <Icon name="Chrome" className="w-4 h-4" /> Continue with Google
        </button>

        <p className="text-center text-xs text-slate-400 mt-5">Demo app — any email/password works.</p>
      </motion.div>
    </div>
  )
}
