import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: '🏠 Dashboard' },
  { to: '/exercises', label: '💪 Exercises' },
  { to: '/workouts', label: '🏋️ Workouts' },
  { to: '/nutrition', label: '🥗 Nutrition' },
  { to: '/progress', label: '📈 Progress' },
  { to: '/goals', label: '🎯 Goals' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-black text-2xl text-primary">⚡ FitTrack</Link>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.to
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
