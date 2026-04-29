import { useState } from 'react'
import { useFitness } from '../context/FitnessContext'

const TYPES = ['Strength', 'Cardio', 'Yoga', 'HIIT', 'Flexibility', 'Sports', 'Other']
const TYPE_ICONS = { Strength: '💪', Cardio: '🏃', Yoga: '🧘', HIIT: '⚡', Flexibility: '🤸', Sports: '⚽', Other: '🏋️' }

export default function WorkoutsPage() {
  const { state, dispatch } = useFitness()
  const { workouts } = state
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [form, setForm] = useState({ name: '', type: 'Strength', duration: '', calories: '', date: new Date().toISOString().split('T')[0], notes: '' })

  const handleAdd = () => {
    if (!form.name.trim() || !form.duration) return
    dispatch({ type: 'ADD_WORKOUT', payload: form })
    setForm({ name: '', type: 'Strength', duration: '', calories: '', date: new Date().toISOString().split('T')[0], notes: '' })
    setShowForm(false)
  }

  let filtered = filter ? workouts.filter((w) => w.type === filter) : workouts
  if (sortBy === 'newest') filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))
  else if (sortBy === 'oldest') filtered = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date))
  else if (sortBy === 'duration') filtered = [...filtered].sort((a, b) => b.duration - a.duration)
  else if (sortBy === 'calories') filtered = [...filtered].sort((a, b) => b.calories - a.calories)

  const totalCalories = workouts.reduce((a, w) => a + (Number(w.calories) || 0), 0)
  const totalMinutes = workouts.reduce((a, w) => a + (Number(w.duration) || 0), 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-3xl font-black">🏋️ My Workouts</h1>
          <p className="text-gray-400 text-sm mt-1">{workouts.length} total · {totalMinutes} mins · {totalCalories} kcal burned</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          + Log Workout
        </button>
      </div>

      {/* Log Form */}
      {showForm && (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 mb-6">
          <h3 className="text-white font-bold mb-4">Log New Workout</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Workout name *"
              className="px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <input
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="Duration (minutes) *"
              className="px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <input
              type="number"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
              placeholder="Calories burned"
              className="px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes (optional)"
              className="px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark">Save</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-gray-700 text-gray-400 text-sm hover:bg-gray-800">Cancel</button>
          </div>
        </div>
      )}

      {/* Filter & Sort */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilter('')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!filter ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>All</button>
        {TYPES.map((t) => (
          <button key={t} onClick={() => setFilter(filter === t ? '' : t)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === t ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {TYPE_ICONS[t]} {t}
          </button>
        ))}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="ml-auto px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full text-xs border border-gray-700 outline-none">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="duration">By Duration</option>
          <option value="calories">By Calories</option>
        </select>
      </div>

      {/* Workout List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
          <div className="text-5xl mb-3">🏃</div>
          <p className="text-gray-400">No workouts yet. Log your first workout!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((w) => (
            <div key={w.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-2xl shrink-0">
                {TYPE_ICONS[w.type] || '🏋️'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold">{w.name}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{w.type}</span>
                  <span className="text-xs text-gray-400">⏱ {w.duration} min</span>
                  {w.calories && <span className="text-xs text-orange-400">🔥 {w.calories} kcal</span>}
                  <span className="text-xs text-gray-500">{new Date(w.date).toLocaleDateString('en-IN')}</span>
                </div>
                {w.notes && <p className="text-gray-500 text-xs mt-1">📝 {w.notes}</p>}
              </div>
              <button
                onClick={() => dispatch({ type: 'DELETE_WORKOUT', payload: w.id })}
                className="text-gray-600 hover:text-red-500 transition-colors text-lg shrink-0"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
