import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  componentDidCatch(e, i) { console.error(e, i) }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900 rounded-2xl max-w-md">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-white text-2xl font-bold mb-2">Something went wrong!</h2>
          <p className="text-gray-400 text-sm mb-6">{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })} className="bg-primary text-white px-6 py-2 rounded-lg font-medium">Try Again</button>
        </div>
      </div>
    )
    return this.props.children
  }
}
