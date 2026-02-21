import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'

export default function DuelSetup() {
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const navigate = useNavigate()

  const handleStart = (e) => {
    e.preventDefault()
    const params = new URLSearchParams({
      p1: p1 || 'Jugador 1',
      p2: p2 || 'Jugador 2',
    })
    navigate(`/duel/play?${params}`)
  }

  return (
    <AppShell>
      <div className="min-h-dvh flex flex-col items-center justify-center">
        <h1 className="font-serif text-3xl italic text-gold mb-2">Duelo 1v1</h1>
        <p className="text-text-secondary mb-8">Mismo dispositivo, turnos alternados</p>

        <form onSubmit={handleStart} className="w-full max-w-sm space-y-4">
          <div>
            <label className="text-sm text-text-secondary mb-1 block">Jugador 1</label>
            <input
              type="text"
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              placeholder="Jugador 1"
              maxLength={20}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-sm text-text-secondary mb-1 block">Jugador 2</label>
            <input
              type="text"
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              placeholder="Jugador 2"
              maxLength={20}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gold text-dark font-bold py-3 rounded-lg hover:bg-gold-light transition-colors"
          >
            Empezar Duelo
          </button>
        </form>
      </div>
    </AppShell>
  )
}
