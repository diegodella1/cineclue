import { useNavigate } from 'react-router-dom'
import { getScoreBadge } from '../../lib/constants'

export default function GameOver({ totalScore, maxScore, roundResults, gameResult, onPlayAgain }) {
  const navigate = useNavigate()
  const badge = getScoreBadge(totalScore)

  const diffColors = {
    'fácil': 'text-success',
    'medio': 'text-gold',
    'difícil': 'text-error',
  }

  return (
    <div className="animate-fadeIn space-y-6 py-6">
      <div className="text-center space-y-2">
        <p className="text-4xl">{badge.icon}</p>
        <p className="text-sm text-text-secondary">{badge.label}</p>
        <p className="text-4xl font-mono text-gold font-bold">{totalScore} / {maxScore}</p>
      </div>

      {/* ELO + XP deltas */}
      {gameResult && (
        <div className="flex justify-center gap-6 text-center">
          <div>
            <p className={`text-lg font-mono font-bold ${gameResult.elo_delta >= 0 ? 'text-success' : 'text-error'}`}>
              {gameResult.elo_delta >= 0 ? '+' : ''}{gameResult.elo_delta} ELO
            </p>
            <p className="text-xs text-text-secondary">{gameResult.elo_after}</p>
          </div>
          <div>
            <p className="text-lg font-mono font-bold text-gold">+{gameResult.xp_earned} XP</p>
            <p className="text-xs text-text-secondary">Nivel {gameResult.new_level}</p>
          </div>
        </div>
      )}

      <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
        {roundResults.map((r, i) => (
          <div key={i} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-dark-border' : ''}`}>
            <div className="flex-1 min-w-0">
              <a
                href={`https://letterboxd.com/film/${r.lb}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white hover:text-gold truncate block"
              >
                {r.title}
              </a>
            </div>
            <span className={`text-xs font-mono mx-3 ${diffColors[r.diff]}`}>
              {r.diff.toUpperCase()}
            </span>
            <span className={`text-sm font-mono ${r.guessed ? 'text-gold' : 'text-text-secondary'}`}>
              {r.points_earned} pts
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onPlayAgain}
          className="w-full bg-gold text-dark font-bold py-3 rounded-lg hover:bg-gold-light transition-colors"
        >
          Jugar de nuevo
        </button>
        <button
          onClick={() => navigate('/home')}
          className="w-full border border-dark-border text-text-secondary py-3 rounded-lg hover:border-gold/50 hover:text-white transition-colors"
        >
          Menú
        </button>
      </div>
    </div>
  )
}
