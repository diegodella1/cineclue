import { CLUE_LABELS, POINTS_BY_CLUE } from '../../lib/constants'

export default function ClueCard({ clues, currentClue }) {
  return (
    <div className="space-y-3">
      {clues.map((clue, i) => {
        const revealed = i <= currentClue
        const isCurrent = i === currentClue
        return (
          <div
            key={i}
            className={`rounded-xl p-4 transition-all duration-300 ${
              isCurrent
                ? 'bg-dark-card border border-gold/30 glow-gold'
                : revealed
                  ? 'bg-dark-card/50 border border-dark-border opacity-60'
                  : 'bg-dark-card/20 border border-dark-border/30 opacity-30'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={`text-xs font-mono ${isCurrent ? 'text-gold' : 'text-text-secondary'}`}>
                Pista {i + 1} — {CLUE_LABELS[i]}
              </span>
              <span className={`text-xs font-mono ${isCurrent ? 'text-gold' : 'text-text-secondary'}`}>
                {POINTS_BY_CLUE[i]} pts
              </span>
            </div>
            {revealed ? (
              <p className={`text-sm leading-relaxed ${i === 0 ? 'text-2xl tracking-wider' : ''}`}>
                {clue}
              </p>
            ) : (
              <p className="text-sm text-text-secondary">???</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
