import { useEffect } from 'react'
import { useDaily } from '../hooks/useDaily'
import AppShell from '../components/layout/AppShell'
import ClueCard from '../components/game/ClueCard'
import GuessInput from '../components/game/GuessInput'
import DailyStats from '../components/game/DailyStats'
import Countdown from '../components/game/Countdown'
import Loading from '../components/shared/Loading'

export default function DailyGame() {
  const {
    movie, currentClue, alreadyPlayed, result, stats, loading, shaking,
    loadDaily, handleGuess, handleSkip, revealNextClue,
  } = useDaily()

  useEffect(() => {
    loadDaily()
  }, [])

  if (loading) return <AppShell><Loading /></AppShell>

  if (!movie) {
    return (
      <AppShell>
        <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
          <p className="text-text-secondary">No hay peli del día programada</p>
          <Countdown />
        </div>
      </AppShell>
    )
  }

  // Already played or just finished
  if (alreadyPlayed || result) {
    const displayResult = result || (alreadyPlayed ? { guessed: false, points_earned: 0 } : null)
    return (
      <AppShell>
        <div className="pt-6 pb-6 space-y-6">
          <h1 className="font-serif text-xl text-gold text-center">Peli del Día</h1>

          <div className="text-center space-y-2">
            {result?.guessed ? (
              <>
                <p className="text-success text-lg font-bold">Correcto!</p>
                <p className="text-gold text-3xl font-mono animate-pop">+{result.points_earned} pts</p>
              </>
            ) : alreadyPlayed ? (
              <p className="text-text-secondary">Ya jugaste hoy</p>
            ) : (
              <p className="text-text-secondary text-lg">Sin puntos</p>
            )}
            <h2 className="text-3xl font-serif text-gold">{movie.title}</h2>
            <span className={`inline-block text-xs font-mono px-2 py-1 rounded border border-dark-border ${
              movie.diff === 'fácil' ? 'text-success' : movie.diff === 'medio' ? 'text-gold' : 'text-error'
            }`}>
              {movie.diff.toUpperCase()}
            </span>
            <div>
              <a
                href={`https://letterboxd.com/film/${movie.lb}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-light text-sm hover:underline"
              >
                Ver en Letterboxd
              </a>
            </div>
          </div>

          <DailyStats stats={stats} />
          <Countdown />
        </div>
      </AppShell>
    )
  }

  // Playing
  return (
    <AppShell>
      <div className="pt-6 pb-6 space-y-6">
        <div className="text-center">
          <h1 className="font-serif text-xl text-gold">Peli del Día</h1>
          <p className="text-xs text-text-secondary">{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>

        <div className="flex items-center justify-center">
          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
            movie.diff === 'fácil' ? 'text-success border-success/30' :
            movie.diff === 'medio' ? 'text-gold border-gold/30' :
            'text-error border-error/30'
          }`}>
            {movie.diff.toUpperCase()}
          </span>
        </div>

        <ClueCard clues={movie.clues} currentClue={currentClue} />

        <GuessInput
          onGuess={handleGuess}
          onSkip={handleSkip}
          onReveal={revealNextClue}
          canReveal={currentClue < 4}
          shaking={shaking}
          disabled={false}
        />
      </div>
    </AppShell>
  )
}
