import { useState } from 'react'
import { useFitness } from '../context/FitnessContext'
import { useDebounce } from '../hooks/useDebounce'

const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

export default function NutritionPage() {
  const { state, dispatch } = useFitness()
  const { calorieLog, goals } = state
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', meal: 'Breakfast' })
  const [activeTab, setActiveTab] = useState('log')

  const today = new Date().toISOString().split('T')[0]
  const todayLog = calorieLog.filter((c) => c.date?.startsWith(today))
  const totalCal = todayLog.reduce((a, c) => a + Number(c.calories || 0), 0)
  const totalProtein = todayLog.reduce((a, c) => a + Number(c.protein || 0), 0)
  const totalCarbs = todayLog.reduce((a, c) => a + Number(c.carbs || 0), 0)
  const totalFat = todayLog.reduce((a, c) => a + Number(c.fat || 0), 0)

  const handleAdd = () => {
    if (!form.name.trim() || !form.calories) return
    dispatch({ type: 'LOG_CALORIES', payload: form })
    setForm({ name: '', calories: '', protein: '', carbs: '', fat: '', meal: 'Breakfast' })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-white text-3xl font-black mb-6">🥗 Nutrition Tracker</h1>

      {/* Macros Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Calories', value: totalCal, goal: goals.calories, unit: 'kcal', color: 'text-orange-400', bar: 'bg-orange-400' },
          { label: 'Protein', value: totalProtein, goal: 150, unit: 'g', color: 'text-blue-400', bar: 'bg-blue-400' },
          { label: 'Carbs', value: totalCarbs, goal: 250, unit: 'g', color: 'text-yellow-400', bar: 'bg-yellow-400' },
          { label: 'Fat', value: totalFat, goal: 65, unit: 'g', color: 'text-purple-400', bar: 'bg-purple-400' },
        ].map((m) => (
          <div key={m.label} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">{m.label}</p>
            <p className={`text-xl font-black ${m.color}`}>{m.value}<span className="text-sm font-normal text-gray-500 ml-1">{m.unit}</span></p>
            <div className="h-1.5 bg-gray-800 rounded-full mt-2">
              <div className={`h-full rounded-full ${m.bar}`} style={{ width: `${Math.min(100, (m.value / m.goal) * 100)}%` }} />
            </div>
            <p className="text-gray-600 text-xs mt-1">Goal: {m.goal}{m.unit}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['log', 'history'].map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === t ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {t === 'log' ? '➕ Log Food' : '📋 History'}
          </button>
        ))}
      </div>

      {activeTab === 'log' ? (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-bold mb-4">Add Food Item</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Food name *" className="px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary text-sm" />
            <select value={form.meal} onChange={(e) => setForm({ ...form, meal: e.target.value })} className="px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary text-sm">
              {MEALS.map((m) => <option key={m}>{m}</option>)}
            </select>
            <input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} placeholder="Calories (kcal) *" className="px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary text-sm" />
            <input type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} placeholder="Protein (g)" className="px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary text-sm" />
            <input type="number" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} placeholder="Carbs (g)" className="px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary text-sm" />
            <input type="number" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} placeholder="Fat (g)" className="px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary text-sm" />
          </div>
          <button onClick={handleAdd} className="mt-4 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            + Add Food
          </button>

          {/* Today's meals */}
          {todayLog.length > 0 && (
            <div className="mt-6">
              <h3 className="text-gray-300 font-semibold mb-3">Today's Food Log</h3>
              <div className="space-y-2">
                {MEALS.map((meal) => {
                  const items = todayLog.filter((i) => i.meal === meal)
                  if (!items.length) return null
                  return (
                    <div key={meal}>
                      <p className="text-gray-500 text-xs font-semibold uppercase mb-1">{meal}</p>
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl mb-1">
                          <div className="flex-1">
                            <p className="text-white text-sm">{item.name}</p>
                            <p className="text-gray-400 text-xs">{item.calories} kcal {item.protein ? `· P: ${item.protein}g` : ''} {item.carbs ? `· C: ${item.carbs}g` : ''} {item.fat ? `· F: ${item.fat}g` : ''}</p>
                          </div>
                          <button onClick={() => dispatch({ type: 'DELETE_CALORIE', payload: item.id })} className="text-gray-600 hover:text-red-500 transition-colors">🗑️</button>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-bold mb-4">Full History</h2>
          {calorieLog.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No food logged yet!</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {calorieLog.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{item.name}</p>
                    <p className="text-gray-400 text-xs">{item.meal} · {item.calories} kcal · {new Date(item.date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <button onClick={() => dispatch({ type: 'DELETE_CALORIE', payload: item.id })} className="text-gray-600 hover:text-red-500 transition-colors">🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
