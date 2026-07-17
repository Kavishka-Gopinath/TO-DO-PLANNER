import { cx } from '../lib/utils'

export default function ProgressBar({ value = 0, className, color = 'linear-gradient(90deg,#4F46E5,#7C3AED)' }) {
  return (
    <div className={cx('h-2 w-full rounded-full bg-slate-200/40 dark:bg-white/10 overflow-hidden', className)}>
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color, transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)' }}
      />
    </div>
  )
}
