import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useProfile } from '../hooks/useProfile'
import { getEloRank } from '../lib/constants'
import { xpProgress } from '../lib/xp'
import { signOut } from '../lib/auth'
import AppShell from '../components/layout/AppShell'
import BottomNav from '../components/layout/BottomNav'
import RadarChart from '../components/profile/RadarChart'
import Loading from '../components/shared/Loading'

export default function Profile() {
  const user = useAuthStore(s => s.user)
  const profile = useAuthStore(s => s.profile)
  const navigate = useNavigate()
  const { profileData, loading, loadPublicProfile, getSpecialties, getWeaknesses, getFavoriteDecade, getGenreStats } = useProfile()

  useEffect(() => {
    if (profile?.username) loadPublicProfile(profile.username)
  }, [profile?.username])

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  if (loading || !profileData) return <AppShell><Loading /><BottomNav /></AppShell>

  const rank = getEloRank(profileData.elo)
  const xp = xpProgress(profileData.xp)
  const specialties = getSpecialties(profileData.category_stats)
  const weaknesses = getWeaknesses(profileData.category_stats)
  const favoriteDecade = getFavoriteDecade(profileData.category_stats)
  const genreStats = getGenreStats(profileData.category_stats)

  return (
    <AppShell>
      <div className="pt-6 pb-24 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-full bg-dark-card border-2 border-gold mx-auto flex items-center justify-center text-3xl">
            {profileData.avatar_url ? (
              <img src={profileData.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : '🎬'}
          </div>
          <h1 className="font-bold text-xl">{profileData.display_name}</h1>
          <p className="text-text-secondary text-sm">@{profileData.username}</p>
          <p className="text-gold font-mono">{rank.icon} {rank.title} · {profileData.elo} ELO</p>
        </div>

        {/* XP Bar */}
        <div className="bg-dark-card rounded-xl border border-dark-border p-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Nivel {xp.level}</span>
            <span className="text-text-secondary">{xp.current} / {xp.needed} XP</span>
          </div>
          <div className="h-3 bg-dark-border/30 rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${xp.percent}%` }} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Partidas', value: profileData.games_played },
            { label: 'Puntos', value: profileData.total_score },
            { label: 'Racha', value: profileData.streak_current },
          ].map(s => (
            <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-3 text-center">
              <p className="text-2xl font-mono text-gold">{s.value}</p>
              <p className="text-xs text-text-secondary">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Streak */}
        {profileData.streak_best > 0 && (
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold">Mejor racha</p>
              <p className="text-xs text-text-secondary">{profileData.streak_best} días</p>
            </div>
            <p className="text-2xl font-mono text-gold">{profileData.streak_current}</p>
          </div>
        )}

        {/* Cinematographic identity */}
        {(specialties.length > 0 || weaknesses.length > 0 || favoriteDecade) && (
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 space-y-2">
            <h2 className="font-serif text-lg text-gold">Tu huella cinematográfica</h2>
            {specialties.length > 0 && (
              <p className="text-sm">Especialista en {specialties.join(' y ')}.</p>
            )}
            {favoriteDecade && (
              <p className="text-sm">Tu década fuerte es los {favoriteDecade}.</p>
            )}
            {weaknesses.length > 0 && (
              <p className="text-sm text-text-secondary">Todavía por descubrir: {weaknesses.join(', ')}.</p>
            )}
          </div>
        )}

        {/* Radar chart */}
        {genreStats.length >= 3 && (
          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <h2 className="font-serif text-lg text-gold mb-3">Mapa de géneros</h2>
            <RadarChart data={genreStats} />
          </div>
        )}

        {/* Badges */}
        {profileData.badges && profileData.badges.length > 0 && (
          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <h2 className="font-serif text-lg text-gold mb-3">Logros</h2>
            <div className="grid grid-cols-3 gap-3">
              {profileData.badges.map(b => (
                <div key={b.slug} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 mx-auto flex items-center justify-center text-lg font-bold text-gold">
                    {b.icon}
                  </div>
                  <p className="text-xs mt-1">{b.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full text-text-secondary text-sm py-2 hover:text-error transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
      <BottomNav />
    </AppShell>
  )
}
