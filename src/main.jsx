import React from 'react'
import ReactDOM from 'react-dom/client'
import { FitnessProvider } from './context/FitnessContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FitnessProvider>
      <App />
    </FitnessProvider>
  </React.StrictMode>,
)
