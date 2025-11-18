function TurnCounter() {
  return (
    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-purple-500 p-1">
      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white/90 text-sm">
        Turn
      </div>
    </div>
  )
}

function CombatLog() {
  const logs = [
    { t: 'Blue', m: "recruited a Soldier" },
    { t: 'Orange', m: "built a Bridge" },
    { t: 'Green', m: "attacked a Bandit" },
  ]
  return (
    <div className="bg-black/30 text-white/80 border border-white/10 rounded-xl p-3 text-sm max-h-28 overflow-y-auto">
      {logs.map((l, i) => (
        <div key={i} className="py-0.5"><span className="text-sky-300">{l.t}:</span> {l.m}</div>
      ))}
    </div>
  )
}

export default function Overlays() {
  return (
    <div className="pointer-events-none fixed inset-0 p-4">
      <div className="flex justify-end">{/* top-right */}
        <TurnCounter />
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <CombatLog />
      </div>
    </div>
  )
}
