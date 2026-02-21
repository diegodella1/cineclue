import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDuel } from '../hooks/useDuel'
import AppShell from '../components/layout/AppShell'
import ClueCard from '../components/game/ClueCard'
import GuessInput from '../components/game/GuessInput'
import RoundResult from '../components/game/RoundResult'
import Loading from '../components/shared/Loading'

export default function DuelGame() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const p1Name = searchParams.get('p1') || 'Jugador 1'
  const p2Name = searchParams.get('p2') || 'Jugador 2'

  const {
    currentPlayer, scores, showResult, lastResult,
    shaking, timer, gameOver,
    movies, currentRound, currentClue, currentMovie,
    loadMovies, startRound, revealNextClue,
    handleGuess, handleSkip, handleNext, reset,
  } = useDuel()

  useEffect(() => {
    loadMovies()
  }, [])

  useEffect(() => {
    if (movies.length > 0 && !gameOver) startRound()
  }, [movies.length])

  if (!movies.length) return <AppShell><Loading /></AppShell>

  const playerName = currentPlayer === 1 ? p1Name : p2Name

  if (gameOver) {
    const winner = scores[1] > scores[2] ? p1Name : scores[2] > scores[1] ? p2Name : 'Empate'
    return (
      <AppShell>
        <div className="pt-6 pb-6 space-y-6 animate-fadeIn">
          <h1 className="font-serif text-2xl text-gold text-center">Fin del Duelo</h1>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className={`bg-dark-card border rounded-xl p-4 ${scores[1] >= scores[2] ? 'border-gold glow-gold' : 'border-dark-border'}`}>
              <p className="text-sm text-text-secondary">{p1Name}</p>
              <p className="text-3xl font-mono text-gold">{scores[1]}</p>
            </div>
            <div className={`bg-dark-card border rounded-xl p-4 ${scores[2] >= scores[1] ? 'border-gold glow-gold' : 'border-dark-border'}`}>
              <p className="text-sm text-text-secondary">{p2Name}</p>
              <p className="text-3xl font-mono text-gold">{scores[2]}</p>
            </div>
          </div>

          <p className="text-center text-lg font-bold text-gold">
            {winner === 'Empate' ? 'Empate!' : `Ganó ${winner}!`}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => { reset(); loadMovies() }}
              className="w-full bg-gold text-dark font-bold py-3 rounded-lg hover:bg-gold-light transition-colors"
            >
              Revancha
            </button>
            <button
              onClick={() => navigate('/home')}
              className="w-full border border-dark-border text-text-secondary py-3 rounded-lg hover:text-white transition-colors"
            >
              Menú
            </button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="pt-6 pb-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="font-serif text-xl text-gold">Ronda {currentRound + 1} / {movies.length}</h1>
          <div className="text-right">
            <span className="text-xs text-text-secondary">{p1Name}: {scores[1]}</span>
            <span className="text-xs text-text-secondary mx-1">|</span>
            <span className="text-xs text-text-secondary">{p2Name}: {scores[2]}</span>
          </div>
        </div>

        {/* Current player + timer */}
        <div className="flex justify-between items-center bg-dark-card border border-gold/20 rounded-lg px-4 py-2">
          <span className="text-sm font-bold text-gold">Turno: {playerName}</span>
          <span className={`font-mono text-lg ${timer <= 3 ? 'text-error' : 'text-gold'}`}>{timer}s</span>
        </div>

        {showResult && lastResult ? (
          <RoundResult result={lastResult} onNext={handleNext} />
        ) : currentMovie ? (
          <>
            <ClueCard clues={currentMovie.clues} currentClue={currentClue} />
            <GuessInput
              onGuess={handleGuess}
              onSkip={handleSkip}
              onReveal={revealNextClue}
              canReveal={currentClue < 4}
              shaking={shaking}
              disabled={showResult}
            />
          </>
        ) : null}
      </div>
    </AppShell>
  )
}
