import { useState } from 'react'

export default function GuessInput({ onGuess, onSkip, onReveal, canReveal, shaking, disabled }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim() || disabled) return
    const correct = onGuess(value.trim())
    if (correct) setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="¿Qué película es?"
        disabled={disabled}
        className={`w-full bg-dark-card border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-gold transition-colors ${
          shaking ? 'animate-shake border-error' : 'border-dark-border'
        }`}
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className="flex-1 bg-gold text-dark font-bold py-3 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Adivinar
        </button>
        {canReveal && (
          <button
            type="button"
            onClick={onReveal}
            disabled={disabled}
            className="flex-1 border border-dark-border text-text-secondary py-3 rounded-lg hover:border-gold/50 hover:text-white transition-colors disabled:opacity-40"
          >
            Siguiente pista
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onSkip}
        disabled={disabled}
        className="w-full text-text-secondary text-sm py-2 hover:text-white transition-colors disabled:opacity-40"
      >
        Pasar
      </button>
    </form>
  )
}
