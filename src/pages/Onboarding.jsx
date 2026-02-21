import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import AppShell from '../components/layout/AppShell'

export default function Onboarding() {
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const updateProfile = useAuthStore(s => s.updateProfile)

  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/

  useEffect(() => {
    if (!username || !usernameRegex.test(username)) {
      setAvailable(null)
      return
    }
    const timeout = setTimeout(async () => {
      setChecking(true)
      const { data } = await supabase
        .from('cc_profiles')
        .select('id')
        .eq('username', username.toLowerCase())
        .maybeSingle()
      setAvailable(!data)
      setChecking(false)
    }, 400)
    return () => clearTimeout(timeout)
  }, [username])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!available || !displayName.trim()) return
    setLoading(true)
    setError('')
    const { error: err } = await updateProfile({
      username: username.toLowerCase(),
      display_name: displayName.trim(),
    })
    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }
    navigate('/home')
  }

  return (
    <AppShell>
      <div className="min-h-dvh flex flex-col items-center justify-center">
        <h1 className="font-serif text-3xl italic text-gold mb-2">Elegí tu identidad</h1>
        <p className="text-text-secondary mb-8">Tu nombre público en CineClue</p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div>
            <label className="text-sm text-text-secondary mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
              placeholder="cinefilo_99"
              maxLength={20}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-gold"
            />
            {username && (
              <p className={`text-xs mt-1 ${
                !usernameRegex.test(username) ? 'text-error' :
                checking ? 'text-text-secondary' :
                available ? 'text-success' : 'text-error'
              }`}>
                {!usernameRegex.test(username) ? '3-20 caracteres, letras/números/_/-' :
                 checking ? 'Verificando...' :
                 available ? 'Disponible' : 'Ya está tomado'}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-text-secondary mb-1 block">Nombre público</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              maxLength={40}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-gold"
            />
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !available || !displayName.trim()}
            className="w-full bg-gold text-dark font-bold py-3 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Empezar a jugar'}
          </button>
        </form>
      </div>
    </AppShell>
  )
}
