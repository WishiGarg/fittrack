import { useState } from 'react'
import { useFitness } from '../context/FitnessContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'

export default function ProgressPage() {
  const { state, dispatch } = useFitness()
  const { weightLog, workouts, calorieLog } = state
  const [weight, setWeight] = useState('')

  const handleLogWeight = () => {
    if (!weight) return
    dispatch({ type: 'LOG_WEIGHT', payload: Number(weight) })
    setWeight('')
  }

  const weightData = [...weightLog].reverse().slice(-14).map((w) => ({
    date: new Date(w.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    weight: w.weight,
  }))

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' })
    const dayWorkouts = workouts.filter((w) => w.date?.startsWith(dateStr))
    const dayCalories = calorieLog.filter((c) => c.date?.startsWith(dateStr)).reduce((a, c) => a + Number(c.calories || 0), 0)
    return { day: label, workouts: dayWorkouts.length, calories: dayCalories }
  })

  const totalWorkouts = workouts.length
  const totalMinutes = workouts.reduce((a, w) => a + Number(w.duration || 0), 0)
  const totalCaloriesBurned = workouts.reduce((a, w) => a + Number(w.calories || 0), 0)
  const currentWeight = weightLog[0]?.weight || null
  const startWeight = weightLog[weightLog.length - 1]?.weight || null
  const weightChange = currentWeight && startWeight ? (currentWeight - startWeight).toFixed(1) : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-white text-3xl font-black mb-8">📈 Progress Tracker</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Workouts', value: totalWorkouts, icon: '🏋️' },
          { label: 'Total Minutes', value: totalMinutes, icon: '⏱️' },
          { label: 'Calories Burned', value: totalCaloriesBurned, icon: '🔥' },
          { label: 'Weight Change', value: weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange} kg` : 'N/A', icon: '⚖️' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-white text-2xl font-black">{s.value}</div>
            <div className="text-gray-400 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Log Weight */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
        <h2 className="text-white font-bold text-lg mb-4">⚖️ Log Weight</h2>
        <div className="flex gap-3 items-center">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight in kg"
            className="w-40 px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button onClick={handleLogWeight} className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            Log Weight
          </button>
          {currentWeight && <span className="text-gray-400 text-sm">Current: <strong className="text-white">{currentWeight} kg</strong></span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Chart */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-bold text-lg mb-4">⚖️ Weight History</h2>
          {weightData.length < 2 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-sm">Log at least 2 weights to see chart</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: 8 }} />
                <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} name="Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Weekly Activity */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-bold text-lg mb-4">📅 Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: 8 }} />
              <Bar dataKey="workouts" fill="#10B981" radius={[4, 4, 0, 0]} name="Workouts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
