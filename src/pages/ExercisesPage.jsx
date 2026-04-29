import { useState, useEffect } from 'react'
import { fetchExercises, fetchExerciseCategories, MUSCLE_GROUPS } from '../utils/api'
import { useDebounce } from '../hooks/useDebounce'
import { useFitness } from '../context/FitnessContext'

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const { dispatch } = useFitness()
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    fetchExerciseCategories()
      .then((r) => setCategories(r.data.results || []))
      .catch(console.error)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category])

  useEffect(() => {
    setLoading(true)
    fetchExercises(page, debouncedSearch, category)
      .then((r) => {
        setExercises(r.data.results || [])
        setTotal(r.data.count || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, debouncedSearch, category])

  const totalPages = Math.ceil(total / 20)

  const addToWorkout = (ex) => {
    dispatch({
      type: 'ADD_WORKOUT',
      payload: {
        name: ex.translations?.[0]?.name || ex.uuid,
        type: 'Strength',
        duration: 30,
        calories: 150,
        date: new Date().toISOString(),
        notes: ex.category?.name || '',
      }
    })
    alert('Exercise added to today\'s workout! 💪')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-white text-3xl font-black mb-6">💪 Exercise Library</h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full pl-11 pr-4 py-3 bg-gray-900 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 bg-gray-900 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <p className="text-gray-400 text-sm mb-4">{total} exercises found</p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl h-40 animate-pulse border border-gray-800" />
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🏋️</div>
          <p className="text-gray-400">No exercises found. Try a different search!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {exercises.map((ex) => {
              const name = ex.translations?.find((t) => t.language === 2)?.name || ex.uuid?.slice(0, 8)
              const desc = ex.translations?.find((t) => t.language === 2)?.description?.replace(/<[^>]*>/g, '') || ''
              return (
                <div
                  key={ex.id}
                  className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setSelected(selected?.id === ex.id ? null : ex)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">💪</div>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">{ex.category?.name || 'General'}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">{name}</h3>
                  {desc && <p className="text-gray-400 text-xs line-clamp-2 mb-3">{desc}</p>}
                  {selected?.id === ex.id && (
                    <button
                      onClick={(e) => { e.stopPropagation(); addToWorkout(ex) }}
                      className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      + Add to Today's Workout
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 hover:bg-gray-800 disabled:opacity-40 text-white rounded-lg text-sm font-medium"
            >
              ← Prev
            </button>
            <span className="text-gray-400 text-sm">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 hover:bg-gray-800 disabled:opacity-40 text-white rounded-lg text-sm font-medium"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
