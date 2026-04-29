import { createContext, useContext, useReducer } from 'react'

const FitnessContext = createContext(null)

const initialState = {
  workouts: JSON.parse(localStorage.getItem('workouts') || '[]'),
  waterLog: JSON.parse(localStorage.getItem('waterLog') || '[]'),
  weightLog: JSON.parse(localStorage.getItem('weightLog') || '[]'),
  calorieLog: JSON.parse(localStorage.getItem('calorieLog') || '[]'),
  goals: JSON.parse(localStorage.getItem('goals') || '{"calories":2000,"water":8,"workouts":5}'),
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function reducer(state, action) {
  let next = { ...state }
  switch (action.type) {
    case 'ADD_WORKOUT':
      next.workouts = [{ ...action.payload, id: Date.now() }, ...next.workouts]
      save('workouts', next.workouts)
      break
    case 'DELETE_WORKOUT':
      next.workouts = next.workouts.filter((w) => w.id !== action.payload)
      save('workouts', next.workouts)
      break
    case 'LOG_WATER':
      next.waterLog = [{ date: new Date().toISOString(), glasses: action.payload }, ...next.waterLog]
      save('waterLog', next.waterLog)
      break
    case 'LOG_WEIGHT':
      next.weightLog = [{ date: new Date().toISOString(), weight: action.payload }, ...next.weightLog]
      save('weightLog', next.weightLog)
      break
    case 'LOG_CALORIES':
      next.calorieLog = [{ ...action.payload, id: Date.now(), date: new Date().toISOString() }, ...next.calorieLog]
      save('calorieLog', next.calorieLog)
      break
    case 'DELETE_CALORIE':
      next.calorieLog = next.calorieLog.filter((c) => c.id !== action.payload)
      save('calorieLog', next.calorieLog)
      break
    case 'SET_GOALS':
      next.goals = { ...next.goals, ...action.payload }
      save('goals', next.goals)
      break
    case 'CLEAR_TODAY':
      next.waterLog = next.waterLog.filter((w) => !w.date.startsWith(new Date().toISOString().split('T')[0]))
      next.calorieLog = next.calorieLog.filter((c) => !c.date.startsWith(new Date().toISOString().split('T')[0]))
      save('waterLog', next.waterLog)
      save('calorieLog', next.calorieLog)
      break
    default: break
  }
  return next
}

export function FitnessProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <FitnessContext.Provider value={{ state, dispatch }}>{children}</FitnessContext.Provider>
}

export function useFitness() {
  return useContext(FitnessContext)
}
