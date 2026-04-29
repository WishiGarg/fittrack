import { useFitness } from '../context/FitnessContext'
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'

export default function DashboardPage() {
  const { state, dispatch } = useFitness()
  const { workouts, waterLog, calorieLog, weightLog, goals } = state
  const [waterInput, setWaterInput] = useState(1)

  const today = new Date().toISOString().split('T')[0]

  const todayWorkouts = workouts.filter((w) => w.date?.startsWith(today))
  const todayWater = waterLog.filter((w) => w.date?.startsWith(today)).reduce((a, w) => a + w.glasses, 0)
  const todayCalories = calorieLog.filter((c) => c.date?.startsWith(today)).reduce((a, c) => a + (Number(c.calories) || 0), 0)
  const latestWeight = weightLog[0]?.weight || null

  const waterPct = Math.min(100, (todayWater / goals.water) * 100)
  const caloriePct = Math.min(100, (todayCalories / goals.calories) * 100)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-white text-4xl font-black">⚡ Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!</h1>
        <p className="text-gray-400 mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Workouts", value: todayWorkouts.length, icon: '🏋️', color: 'text-primary', to: '/workouts' },
          { label: 'Calories Today', value: todayCalories, icon: '🔥', color: 'text-orange-400', to: '/nutrition' },
          { label: 'Water Glasses', value: `${todayWater}/${goals.water}`, icon: '💧', color: 'text-blue-400', to: '/nutrition' },
          { label: 'Current Weight', value: latestWeight ? `${latestWeight} kg` : 'Log it!', icon: '⚖️', color: 'text-purple-400', to: '/progress' },
        ].map((s) => (
          <Link key={s.label} to={s.to} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-gray-600 transition-colors block">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-gray-400 text-xs mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Water Tracker */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-bold text-lg mb-4">💧 Water Intake</h2>
          <div className="flex gap-2 mb-4">
            {Array.from({ length: goals.water }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-10 rounded-lg transition-colors ${i < todayWater ? 'bg-blue-500' : 'bg-gray-800'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={10}
              value={waterInput}
              onChange={(e) => setWaterInput(Number(e.target.value))}
              className="w-20 bg-gray-800 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm border border-gray-700"
            />
            <span className="text-gray-400 text-sm">glasses</span>
            <button
              onClick={() => dispatch({ type: 'LOG_WATER', payload: waterInput })}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Log Water
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-3">{todayWater} of {goals.water} glasses today</p>
        </div>

        {/* Calorie Progress */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-bold text-lg mb-4">🔥 Calorie Goal</h2>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{todayCalories} kcal consumed</span>
            <span>Goal: {goals.calories} kcal</span>
          </div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-700 ${caloriePct > 100 ? 'bg-red-500' : caloriePct > 80 ? 'bg-yellow-500' : 'bg-primary'}`}
              style={{ width: `${caloriePct}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs">
            {goals.calories - todayCalories > 0
              ? `${goals.calories - todayCalories} kcal remaining`
              : `${todayCalories - goals.calories} kcal over goal`}
          </p>
          <Link to="/nutrition" className="mt-3 inline-block text-primary text-sm font-medium hover:underline">Log food →</Link>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-bold text-lg">🏋️ Recent Workouts</h2>
          <Link to="/workouts" className="text-primary text-sm hover:underline">View all →</Link>
        </div>
        {workouts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🏃</div>
            <p className="text-gray-400 text-sm">No workouts yet!</p>
            <Link to="/workouts" className="mt-3 inline-block bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">Log Workout</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.slice(0, 5).map((w) => (
              <div key={w.id} className="flex items-center gap-4 p-3 bg-gray-800 rounded-xl">
                <div className="text-2xl">{w.type === 'Cardio' ? '🏃' : w.type === 'Strength' ? '💪' : w.type === 'Yoga' ? '🧘' : '⚡'}</div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{w.name}</p>
                  <p className="text-gray-400 text-xs">{w.type} · {w.duration} min · {new Date(w.date).toLocaleDateString('en-IN')}</p>
                </div>
                <span className="text-primary text-sm font-bold">{w.calories} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
