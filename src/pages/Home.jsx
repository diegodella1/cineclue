import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { getEloRank } from '../lib/constants'
import AppShell from '../components/layout/AppShell'
import BottomNav from '../components/layout/BottomNav'

export default function Home() {
  const navigate = useNavigate()
  const profile = useAuthStore(s => s.profile)
  const rank = profile ? getEloRank(profile.elo) : null

  return (
    <AppShell>
      <div className="pt-6 pb-24 space-y-6">
        {/* Header */}
        {profile && (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-xl">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                '🎬'
              )}
            </div>
            <div>
              <p className="font-bold text-white">{profile.display_name}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-secondary">@{profile.username}</span>
                {rank && (
                  <span className="text-gold font-mono text-xs">{rank.icon} {profile.elo} ELO</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Daily movie card */}
        <div className="bg-dark-card border border-gold/20 rounded-xl p-5 space-y-3 glow-gold">
          <h2 className="font-serif text-xl text-gold">Peli del Día</h2>
          <p className="text-text-secondary text-sm">1 película para todos. Demostrá tu ojo cinéfilo.</p>
          <button
            onClick={() => navigate('/daily')}
            className="w-full bg-gold text-dark font-bold py-3 rounded-lg hover:bg-gold-light transition-colors"
          >
            Jugar Peli del Día
          </button>
        </div>

        {/* Solo game card */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-3">
          <h2 className="font-serif text-xl text-gold">Modo Solo</h2>
          <p className="text-text-secondary text-sm">5 películas, 5 pistas cada una. Demostrá cuánto sabés de cine.</p>
          <button
            onClick={() => navigate('/solo')}
            className="w-full bg-gold text-dark font-bold py-3 rounded-lg hover:bg-gold-light transition-colors"
          >
            Jugar Solo
          </button>
        </div>

        {/* Duel card */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 space-y-3">
          <h2 className="font-serif text-xl text-gold">Duelo 1v1</h2>
          <p className="text-text-secondary text-sm">Desafiá a alguien en el mismo celular.</p>
          <button
            onClick={() => navigate('/duel')}
            className="w-full border border-gold text-gold font-bold py-3 rounded-lg hover:bg-gold hover:text-dark transition-colors"
          >
            Iniciar Duelo
          </button>
        </div>

        {/* Stats cards */}
        {profile && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-dark-card border border-dark-border rounded-xl p-3 text-center">
              <p className="text-2xl font-mono text-gold">{profile.games_played}</p>
              <p className="text-xs text-text-secondary">Partidas</p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-3 text-center">
              <p className="text-2xl font-mono text-gold">{profile.total_score}</p>
              <p className="text-xs text-text-secondary">Puntos</p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-3 text-center">
              <p className="text-2xl font-mono text-gold">{profile.level}</p>
              <p className="text-xs text-text-secondary">Nivel</p>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </AppShell>
  )
}
