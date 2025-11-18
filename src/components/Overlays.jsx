import { useGame } from './GameState'

function TurnCounter() {
  const { currentPlayer, turn } = useGame()
  const grad =
    currentPlayer.id === 'blue'
      ? 'from-sky-500 to-blue-500'
      : currentPlayer.id === 'green'
      ? 'from-emerald-500 to-green-500'
      : currentPlayer.id === 'orange'
      ? 'from-amber-500 to-orange-500'
      : 'from-fuchsia-500 to-purple-500'
  return (
    <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${grad} p-1`}>
      <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center text-white/90 text-xs">
        <div className="text-[10px] uppercase tracking-wide">Turn</div>
        <div className="text-sm font-semibold">{turn}</div>
      </div>
    </div>
  )
}

function CombatLog() {
  const { logs } = useGame()
  return (
    <div className="bg-black/30 text-white/80 border border-white/10 rounded-xl p-3 text-sm max-h-28 overflow-y-auto">
      {logs.map((l, i) => (
        <div key={i} className="py-0.5"><span className="text-sky-300 capitalize">{l.t}:</span> {l.m}</div>
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
