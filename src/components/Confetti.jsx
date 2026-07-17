import { useEffect } from 'react'

const COLORS = ['#4F46E5', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#06B6D4']

export default function Confetti() {
  useEffect(() => {
    const fire = () => {
      const pieces = Array.from({ length: 60 })
      pieces.forEach((_, i) => {
        const el = document.createElement('div')
        el.className = 'confetti'
        const left = Math.random() * 100
        const color = COLORS[i % COLORS.length]
        const delay = Math.random() * 0.3
        const dur = 1.6 + Math.random() * 1.2
        el.style.left = `${left}vw`
        el.style.background = color
        el.style.animationDelay = `${delay}s`
        el.style.animationDuration = `${dur}s`
        document.body.appendChild(el)
        setTimeout(() => el.remove(), (dur + delay) * 1000 + 200)
      })
    }
    window.addEventListener('taskflow:confetti', fire)
    return () => window.removeEventListener('taskflow:confetti', fire)
  }, [])

  return null
}
