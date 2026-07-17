import { useState } from 'react'
import Icon from '../components/Icon'
import { useStore } from '../store'
import { cx } from '../lib/utils'

function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} className={cx('w-11 h-6 rounded-full transition relative', on ? 'bg-primary' : 'bg-slate-400/40')}>
      <span className={cx('absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  )
}

function Row({ icon, label, desc, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[var(--border)] last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-500/10 grid place-items-center"><Icon name={icon} className="w-4 h-4 text-slate-500" /></div>
        <div>
          <p className="font-medium text-sm">{label}</p>
          {desc && <p className="text-xs text-slate-500">{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { darkMode, toggleDark, addToast } = useStore()
  const [notif, setNotif] = useState(true)
  const [sync, setSync] = useState(true)

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Settings</h3>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-6">
          <h4 className="font-semibold mb-2 flex items-center gap-2"><Icon name="Settings" className="w-4 h-4" /> General</h4>
          <Row icon="Moon" label="Dark Mode" desc="Toggle the theme"><Toggle on={darkMode} onToggle={toggleDark} /></Row>
          <Row icon="Globe" label="Language" desc="English (US)">
            <select className="px-3 py-2 rounded-xl glass-soft text-sm outline-none"><option>English</option><option>සිංහල</option><option>日本語</option></select>
          </Row>
          <Row icon="Bell" label="Notifications" desc="Push reminders"><Toggle on={notif} onToggle={() => setNotif((v) => !v)} /></Row>
          <Row icon="Cloud" label="Cloud Sync" desc="Auto-sync across devices"><Toggle on={sync} onToggle={() => setSync((v) => !v)} /></Row>
        </div>

        <div className="glass rounded-3xl p-6">
          <h4 className="font-semibold mb-2 flex items-center gap-2"><Icon name="CalendarSync" className="w-4 h-4" /> Calendar Sync</h4>
          <Row icon="Calendar" label="Google Calendar"><button onClick={() => addToast('Connected to Google Calendar', 'success')} className="px-3 py-1.5 rounded-lg text-primary text-sm font-medium bg-primary/10 hover:bg-primary/20">Connect</button></Row>
          <Row icon="Mail" label="Outlook"><button onClick={() => addToast('Connected to Outlook', 'success')} className="px-3 py-1.5 rounded-lg text-primary text-sm font-medium bg-primary/10 hover:bg-primary/20">Connect</button></Row>
          <Row icon="Download" label="Export Data"><button onClick={() => addToast('Export started', 'info')} className="px-3 py-1.5 rounded-lg glass-soft text-sm hover:bg-slate-500/10">Export</button></Row>
          <Row icon="Database" label="Backup"><button onClick={() => addToast('Backup complete', 'success')} className="px-3 py-1.5 rounded-lg glass-soft text-sm hover:bg-slate-500/10">Backup Now</button></Row>
        </div>

        <div className="glass rounded-3xl p-6">
          <h4 className="font-semibold mb-2 flex items-center gap-2"><Icon name="Shield" className="w-4 h-4" /> Account & Security</h4>
          <Row icon="Key" label="Two-Factor Auth" desc="Extra protection"><button className="px-3 py-1.5 rounded-lg text-primary text-sm font-medium bg-primary/10">Enable</button></Row>
          <Row icon="Lock" label="Change Password"><button className="px-3 py-1.5 rounded-lg glass-soft text-sm hover:bg-slate-500/10">Update</button></Row>
          <Row icon="Trash2" label="Delete Account" desc="Permanently"><button className="px-3 py-1.5 rounded-lg text-danger text-sm font-medium bg-danger/10 hover:bg-danger/20">Delete</button></Row>
        </div>

        <div className="glass rounded-3xl p-6">
          <h4 className="font-semibold mb-2 flex items-center gap-2"><Icon name="Palette" className="w-4 h-4" /> Appearance</h4>
          <Row icon="Type" label="Font Size" desc="Medium">
            <select className="px-3 py-2 rounded-xl glass-soft text-sm outline-none"><option>Small</option><option>Medium</option><option>Large</option></select>
          </Row>
          <Row icon="Contrast" label="High Contrast" desc="Accessibility"><Toggle on={false} onToggle={() => {}} /></Row>
          <Row icon="Sparkles" label="Reduced Motion"><Toggle on={false} onToggle={() => {}} /></Row>
        </div>
      </div>
    </div>
  )
}
