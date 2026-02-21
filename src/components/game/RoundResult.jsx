export default function RoundResult({ result, onNext }) {
  const diffColors = {
    'fácil': 'text-success',
    'medio': 'text-gold',
    'difícil': 'text-error',
  }

  return (
    <div className="animate-fadeIn text-center space-y-4 py-6">
      {result.guessed ? (
        <>
          <p className="text-success text-lg font-bold">Correcto!</p>
          <p className="text-gold text-3xl font-mono animate-pop">+{result.points_earned} pts</p>
        </>
      ) : (
        <p className="text-text-secondary text-lg">Sin puntos</p>
      )}

      <h2 className="text-2xl font-serif text-gold">{result.title}</h2>

      <span className={`inline-block text-xs font-mono px-2 py-1 rounded border border-dark-border ${diffColors[result.diff]}`}>
        {result.diff.toUpperCase()}
      </span>

      <div>
        <a
          href={`https://letterboxd.com/film/${result.lb}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold-light text-sm hover:underline"
        >
          {result.guessed ? 'Ver en Letterboxd' : 'Descubrila en Letterboxd'}
        </a>
      </div>

      <button
        onClick={onNext}
        className="bg-gold text-dark font-bold py-3 px-8 rounded-lg hover:bg-gold-light transition-colors"
      >
        Siguiente
      </button>
    </div>
  )
}
