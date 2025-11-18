function UnitPanel() {
  return (
    <div className="bg-[#2a2a2a] text-white/90 rounded-xl p-4 border border-white/10 w-full">
      <h3 className="font-semibold mb-3">Selected Unit</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-white/70">Type</span><span className="text-lime-300">—</span></div>
        <div className="flex justify-between"><span className="text-white/70">Owner</span><span className="text-lime-300">—</span></div>
        <div className="flex justify-between"><span className="text-white/70">Position</span><span className="text-lime-300">—</span></div>
        <div className="flex justify-between"><span className="text-white/70">Movement</span><span className="text-lime-300">—</span></div>
      </div>
    </div>
  )
}

function StatsPanel() {
  const players = [
    { name: 'Blue', color: 'text-sky-300', wood: 2, food: 3, incomeW: 1, incomeF: 1 },
    { name: 'Green', color: 'text-emerald-300', wood: 2, food: 2, incomeW: 1, incomeF: 1 },
    { name: 'Orange', color: 'text-amber-300', wood: 1, food: 2, incomeW: 1, incomeF: 0 },
    { name: 'Purple', color: 'text-fuchsia-300', wood: 3, food: 1, incomeW: 0, incomeF: 1 },
  ]

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 w-full">
      <h3 className="text-white/90 font-semibold mb-3">Players</h3>
      <div className="space-y-3">
        {players.map((p) => (
          <div key={p.name} className="grid grid-cols-3 gap-2 items-center text-sm">
            <div className={`font-medium ${p.color}`}>{p.name}</div>
            <div className="text-white/80">🌲 {p.wood} (+{p.incomeW}) • 🌾 {p.food} (+{p.incomeF})</div>
            <div className="flex items-center justify-end gap-2">
              <button className="px-2 py-1 rounded bg-white/10 text-white/80 hover:bg-white/15">⛏️</button>
              <button className="px-2 py-1 rounded bg-white/10 text-white/80 hover:bg-white/15">⚔️</button>
              <button className="px-2 py-1 rounded bg-white/10 text-white/80 hover:bg-white/15">🪖</button>
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
