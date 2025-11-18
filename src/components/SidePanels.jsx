import { useGame } from './GameState'

function colorClass(id) {
  switch (id) {
    case 'blue':
      return 'text-sky-300'
    case 'green':
      return 'text-emerald-300'
    case 'orange':
      return 'text-amber-300'
    case 'purple':
      return 'text-fuchsia-300'
    default:
      return 'text-white'
  }
}

function UnitPanel() {
  const { units, selectedId } = useGame()
  const unit = units.find((u) => u.id === selectedId)
  return (
    <div className="bg-[#2a2a2a] text-white/90 rounded-xl p-4 border border-white/10 w-full">
      <h3 className="font-semibold mb-3">Selected Unit</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-white/70">Type</span><span className="text-lime-300">{unit?.type ?? '—'}</span></div>
        <div className="flex justify-between"><span className="text-white/70">Owner</span><span className={`text-lime-300 ${unit ? colorClass(unit.owner) : ''}`}>{unit?.owner ?? '—'}</span></div>
        <div className="flex justify-between"><span className="text-white/70">Position</span><span className="text-lime-300">{unit ? `${unit.x + 1}, ${unit.y + 1}` : '—'}</span></div>
        <div className="flex justify-between"><span className="text-white/70">Movement</span><span className="text-lime-300">{unit ? `${unit.mp}/${unit.maxMp}` : '—'}</span></div>
      </div>
    </div>
  )
}

function StatsPanel() {
  const { players, currentPlayer, actions } = useGame()

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/90 font-semibold">Players</h3>
        <button onClick={actions.endTurn} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-fuchsia-600 text-white text-sm hover:opacity-90">End Turn</button>
      </div>
      <div className="space-y-3">
        {players.map((p) => (
          <div key={p.id} className={`grid grid-cols-3 gap-2 items-center text-sm ${p.id === currentPlayer.id ? 'bg-white/5 rounded-lg p-2' : ''}`}>
            <div className={`font-medium ${colorClass(p.id)}`}>{p.name}</div>
            <div className="text-white/80">🌲 {p.wood} (+{p.incomeW}) • 🌾 {p.food} (+{p.incomeF})</div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => actions.recruit('Worker', p.id)} className="px-2 py-1 rounded bg-white/10 text-white/80 hover:bg-white/15">⛏️</button>
              <button onClick={() => actions.recruit('Soldier', p.id)} className="px-2 py-1 rounded bg-white/10 text-white/80 hover:bg-white/15">⚔️</button>
              <button onClick={() => actions.recruit('Catapult', p.id)} className="px-2 py-1 rounded bg-white/10 text-white/80 hover:bg-white/15">🪖</button>
              <label className="inline-flex items-center gap-1 text-white/70 text-xs">
                <input type="checkbox" className="accent-sky-400" /> AI
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SidePanels() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_320px] gap-4 items-start">
      <UnitPanel />
      <div className="hidden md:block" />
      <StatsPanel />
    </div>
  )
}
