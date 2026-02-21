import { useState, useEffect } from 'react'

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      // Next day at midnight ART (UTC-3)
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(3, 0, 0, 0) // 03:00 UTC = 00:00 ART

      if (tomorrow < now) {
        tomorrow.setDate(tomorrow.getDate() + 1)
      }

      const diff = tomorrow - now
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center">
      <p className="text-xs text-text-secondary">Próxima peli del día en</p>
      <p className="text-2xl font-mono text-gold">{timeLeft}</p>
    </div>
  )
}
