import { useState } from 'react'
import { useFitness } from '../context/FitnessContext'

export default function GoalsPage() {
  const { state, dispatch } = useFitness()
  const { goals, workouts, calorieLog, waterLog } = state
  const [form, setForm] = useState({ ...goals })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    dispatch({ type: 'SET_GOALS', payload: form })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const today = new Date().toISOString().split('T')[0]
  const thisWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  })

  const weekWorkouts = workouts.filter((w) => thisWeek.some((d) => w.date?.startsWith(d))).length
  const todayCalories = calorieLog.filter((c) => c.date?.startsWith(today)).reduce((a, c) => a + Number(c.calories || 0), 0)
  const todayWater = waterLog.filter((w) => w.date?.startsWith(today)).reduce((a, w) => a + w.glasses, 0)

  const goalItems = [
    { key: 'calories', label: 'Daily Calorie Goal', unit: 'kcal', icon: '🔥', current: todayCalories, min: 1000, max: 5000, step: 100 },
    { key: 'water', label: 'Daily Water Goal', unit: 'glasses', icon: '💧', current: todayWater, min: 4, max: 20, step: 1 },
    { key: 'workouts', label: 'Weekly Workout Goal', unit: 'workouts/week', icon: '🏋️', current: weekWorkouts, min: 1, max: 14, step: 1 },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-white text-3xl font-black mb-2">🎯 My Goals</h1>
      <p className="text-gray-400 text-sm mb-8">Set your daily and weekly fitness targets</p>

      <div className="space-y-4 mb-8">
        {goalItems.map((g) => {
          const pct = Math.min(100, (g.current / form[g.key]) * 100)
          return (
            <div key={g.key} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{g.icon}</span>
                  <div>
                    <p className="text-white font-semibold">{g.label}</p>
                    <p className="text-gray-400 text-xs">{g.current} / {form[g.key]} {g.unit}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${pct >= 100 ? 'text-primary' : 'text-gray-400'}`}>
                  {pct >= 100 ? '✅ Done!' : `${pct.toFixed(0)}%`}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full mb-4">
                <div className={`h-full rounded-full transition-all duration-700 ${pct >= 100 ? 'bg-primary' : 'bg-gray-600'}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={g.min}
                  max={g.max}
                  step={g.step}
                  value={form[g.key]}
                  onChange={(e) => setForm({ ...form, [g.key]: Number(e.target.value) })}
                  className="flex-1 accent-primary"
                />
                <span className="text-white font-bold w-20 text-right">{form[g.key]} {g.unit.split('/')[0]}</span>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleSave}
        className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-primary hover:bg-primary-dark text-white'}`}
      >
        {saved ? '✅ Goals Saved!' : 'Save Goals'}
      </button>
    </div>
  )
}
