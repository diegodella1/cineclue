import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/home', label: 'Inicio', icon: '🏠' },
  { to: '/ranking', label: 'Ranking', icon: '🏆' },
  { to: '/missions', label: 'Misiones', icon: '🎯' },
  { to: '/profile', label: 'Perfil', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-card/95 backdrop-blur border-t border-dark-border safe-bottom z-40">
      <div className="max-w-[600px] mx-auto flex justify-around">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 text-xs transition-colors ${
                isActive ? 'text-gold' : 'text-text-secondary hover:text-white'
              }`
            }
          >
            <span className="text-lg mb-0.5">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
