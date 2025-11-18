import Hero from './components/Hero'
import GameBoard from './components/GameBoard'
import SidePanels from './components/SidePanels'
import Overlays from './components/Overlays'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="relative max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Title Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white/90">Gather and Rule</h2>
          <div className="text-white/60 text-sm">Prototype</div>
        </div>

        {/* Hero with Spline 3D */}
        <Hero />

        {/* Panels and Board */}
        <SidePanels />
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <GameBoard />
        </div>
      </div>

      {/* UI Overlays */}
      <Overlays />
    </div>
  )
}

export default App
