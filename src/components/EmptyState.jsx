import Icon from './Icon'

export default function EmptyState({ icon = 'Inbox', title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-20 h-20 rounded-3xl gradient-soft grid place-items-center mb-5 animate-float">
        <Icon name={icon} className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-5">{message}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="gradient-primary text-white px-5 py-2.5 rounded-xl font-medium shadow-glow hover:opacity-90 transition flex items-center gap-2"
        >
          <Icon name="Plus" className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
