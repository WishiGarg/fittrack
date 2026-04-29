import axios from 'axios'

// wger API - completely free, no key needed
const WGER = 'https://wger.de/api/v2'

export const fetchExercises = (page = 1, search = '', category = '') =>
  axios.get(`${WGER}/exercise/`, {
    params: {
      format: 'json',
      language: 2,
      limit: 20,
      offset: (page - 1) * 20,
      ...(search ? { term: search } : {}),
      ...(category ? { category } : {}),
    },
  })

export const fetchExerciseCategories = () =>
  axios.get(`${WGER}/exercisecategory/?format=json`)

export const fetchExerciseDetail = (id) =>
  axios.get(`${WGER}/exerciseinfo/${id}/?format=json`)

// Nutritionix Open Food Facts - free, no key
export const searchFood = (query) =>
  axios.get(`https://world.openfoodfacts.org/cgi/search.pl`, {
    params: {
      search_terms: query,
      search_simple: 1,
      action: 'process',
      json: 1,
      page_size: 10,
    },
  })

export const MUSCLE_GROUPS = [
  { id: '', name: 'All' },
  { id: '10', name: 'Abs' },
  { id: '8', name: 'Arms' },
  { id: '12', name: 'Back' },
  { id: '14', name: 'Calves' },
  { id: '11', name: 'Chest' },
  { id: '9', name: 'Legs' },
  { id: '13', name: 'Shoulders' },
]
