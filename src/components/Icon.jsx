import * as Lucide from 'lucide-react'

export default function Icon({ name, className = 'w-5 h-5', ...props }) {
  const Cmp = Lucide[name] || Lucide.Circle
  return <Cmp className={className} {...props} />
}
