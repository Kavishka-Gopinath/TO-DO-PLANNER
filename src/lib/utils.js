export const cx = (...a) => a.filter(Boolean).join(' ')

export const todayISO = () => new Date().toISOString().slice(0, 10)

export const isoToDate = (iso) => {
  if (!iso) return null
  const [y, m, d] = iso.split('T')[0].split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const formatDate = (iso) => {
  const dt = isoToDate(iso)
  if (!dt) return ''
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const isToday = (iso) => iso === todayISO()
export const isOverdue = (iso) => isoToDate(iso) < isoToDate(todayISO())

export const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export const monthMatrix = (year, month) => {
  const first = new Date(year, month, 1)
  const startDay = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
