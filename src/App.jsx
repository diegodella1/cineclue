import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Toast from './components/shared/Toast'
import InstallPrompt from './components/shared/InstallPrompt'
import Loading from './components/shared/Loading'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import SoloGame from './pages/SoloGame'
import DailyGame from './pages/DailyGame'
import Ranking from './pages/Ranking'
import Missions from './pages/Missions'
import Profile from './pages/Profile'
import PublicProfile from './pages/PublicProfile'
import Admin from './pages/Admin'
import DuelSetup from './pages/DuelSetup'
import DuelGame from './pages/DuelGame'
import Landing from './pages/Landing'

function RequireAuth({ children }) {
  const user = useAuthStore(s => s.user)
  const loading = useAuthStore(s => s.loading)
  const needsOnboarding = useAuthStore(s => s.needsOnboarding)
  const location = useLocation()

  if (loading) return <Loading />
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />
  if (needsOnboarding() && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }
  return children
}

export default function App() {
  const init = useAuthStore(s => s.init)
  const loading = useAuthStore(s => s.loading)

  useEffect(() => {
    init()
  }, [])

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <>
      <Toast />
      <InstallPrompt />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
        <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/daily" element={<RequireAuth><DailyGame /></RequireAuth>} />
        <Route path="/solo" element={<RequireAuth><SoloGame /></RequireAuth>} />
        <Route path="/ranking" element={<RequireAuth><Ranking /></RequireAuth>} />
        <Route path="/missions" element={<RequireAuth><Missions /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/duel" element={<RequireAuth><DuelSetup /></RequireAuth>} />
        <Route path="/duel/play" element={<RequireAuth><DuelGame /></RequireAuth>} />
        <Route path="/u/:username" element={<PublicProfile />} />
        <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  )
}
