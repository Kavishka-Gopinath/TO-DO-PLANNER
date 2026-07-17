import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts'
import Icon from '../components/Icon'
import { useStore } from '../store'

const C = ['#4F46E5', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#84CC16']

export default function Analytics() {
  const { tasks, categories } = useStore()
  const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const completedByDay = week.map((d, i) => ({ day: d, tasks: Math.floor(4 + Math.random() * 8 + i), focus: Math.floor(2 + Math.random() * 4) }))
  const catData = categories.map((c) => ({ name: c.name, value: tasks.filter((t) => t.category === c.id).length })).filter((d) => d.value > 0)

  const heat = Array.from({ length: 35 }, (_, i) => ({ day: i, v: Math.random() > 0.4 ? Math.floor(Math.random() * 5) : 0 }))

  const total = tasks.length
  const done = tasks.filter((t) => t.status === 'completed').length
  const rate = total ? Math.round((done / total) * 100) : 0

  const card = 'glass rounded-3xl p-6'

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Analytics</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Tasks Completed', value: done, icon: 'CheckCircle2', color: '#10B981' },
          { label: 'Completion Rate', value: `${rate}%`, icon: 'Target', color: '#4F46E5' },
          { label: 'Focus Hours', value: '28.5h', icon: 'Timer', color: '#F59E0B' },
          { label: 'Productivity', value: '86', icon: 'Zap', color: '#7C3AED' },
        ].map((s) => (
          <div key={s.label} className={card + ' flex items-center gap-4'}>
            <div className="w-12 h-12 rounded-2xl grid place-items-center" style={{ background: `${s.color}1a` }}>
              <Icon name={s.icon} className="w-6 h-6" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className={card + ' lg:col-span-2'}>
          <h4 className="font-semibold mb-4">Weekly Productivity</h4>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={completedByDay}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="tasks" stroke="#4F46E5" strokeWidth={3} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={card}>
          <h4 className="font-semibold mb-4">Category Distribution</h4>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={catData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {catData.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {catData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs"><span className="w-2.5 h-2.5 rounded-full" style={{ background: C[i % C.length] }} />{d.name}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className={card + ' lg:col-span-2'}>
          <h4 className="font-semibold mb-4">Focus Hours</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={completedByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(148,163,184,0.1)' }} />
              <Bar dataKey="focus" radius={[6, 6, 0, 0]} fill="#7C3AED" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={card}>
          <h4 className="font-semibold mb-4 flex items-center gap-2"><Icon name="Flame" className="w-4 h-4 text-danger" /> Streak Heatmap</h4>
          <div className="grid grid-cols-7 gap-1.5">
            {heat.map((h) => (
              <div key={h.day} className="aspect-square rounded-md" title={`${h.v} tasks`} style={{ background: heatColor(h.v) }} />
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 flex items-center gap-2">
            Less <div className="flex gap-1">{[0, 1, 2, 3, 4].map((v) => <span key={v} className="w-3 h-3 rounded" style={{ background: heatColor(v) }} />)}</div> More
          </p>
        </div>
      </div>
    </div>
  )
}

const heatColor = (v) => ['rgba(148,163,184,0.15)', '#C7D2FE', '#A5B4FC', '#818CF8', '#4F46E5'][v] || 'rgba(148,163,184,0.15)'
const tooltipStyle = { background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 12, backdropFilter: 'blur(8px)' }
