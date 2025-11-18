import { useMemo } from 'react'
import { useGame } from './GameState'

const TILE_TYPES = {
  plains: 'plains',
  forest: 'forest',
  water: 'water',
  mountain: 'mountain',
  wood: 'wood',
}

function tileClass(type) {
  switch (type) {
    case 'plains':
      return 'bg-[linear-gradient(135deg,#19452a_0%,#0e3320_100%)]';
    case 'forest':
      return 'bg-[repeating-linear-gradient(45deg,#0d2a17_0_8px,#123821_8px_16px)]';
    case 'water':
      return 'bg-[radial-gradient(circle_at_20%_30%,#0b6bb1_0%,#063a66_50%,#04263f_100%)]';
    case 'mountain':
      return 'bg-[repeating-linear-gradient(45deg,#4b5563_0_6px,#6b7280_6px_12px)]';
    case 'wood':
      return 'bg-[repeating-linear-gradient(90deg,#8b5a2b_0_6px,#a66a35_6px_12px)]';
    default:
      return 'bg-slate-700';
  }
}

function BaseRing({ color }) {
  const ring = color === 'blue' ? 'ring-sky-400/80' : color === 'green' ? 'ring-emerald-400/80' : color === 'orange' ? 'ring-amber-400/80' : 'ring-fuchsia-400/80'
  return <div className={`absolute inset-0 rounded-sm ring-2 ${ring}`} />
}

function StackBadge({ count, owner }) {
  if (count <= 1) return null
  const bg = owner === 'blue' ? 'bg-sky-500' : owner === 'green' ? 'bg-emerald-500' : owner === 'orange' ? 'bg-amber-500' : 'bg-fuchsia-500'
  return (
    <div className={`absolute -top-2 -right-2 text-[10px] px-1 rounded ${bg} text-black shadow`}>{count}</div>
  )
}

function EligibleGlow({ active }) {
  if (!active) return null
  return <div className="absolute inset-0 rounded-sm ring-2 ring-lime-400/70 animate-pulse" />
}

function UnitGlyph({ unit }) {
  const col = unit.owner === 'blue' ? 'text-sky-300' : unit.owner === 'green' ? 'text-emerald-300' : unit.owner === 'orange' ? 'text-amber-300' : 'text-fuchsia-300'
  const glyph = unit.type === 'Worker' ? '⛏️' : unit.type === 'Soldier' ? '⚔️' : '🪖'
  return <span className={`drop-shadow ${col}`}>{glyph}</span>
}

function BoardCell({ cell, onClick, unitsHere, selectable, selected }) {
  return (
    <button onClick={onClick} className={`relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-sm border border-black/30 ${tileClass(cell.type)} shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] focus:outline-none`}> 
      {cell.base && <BaseRing color={cell.base} />}
      {cell.base && <div className="absolute inset-0 flex items-center justify-center text-xs">⌂</div>}
      <EligibleGlow active={selectable} />
      {unitsHere.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm">
          <UnitGlyph unit={unitsHere[0]} />
        </div>
      )}
      <StackBadge count={unitsHere.length} owner={unitsHere[0]?.owner} />
      {selected && <div className="absolute inset-0 rounded-sm ring-2 ring-cyan-400/80" />}
    </button>
  )
}

function GameBoard() {
  const { map, actions, utils, selectedId, eligible, units } = useGame()

  const handleCell = (x, y, selectable) => () => {
    if (selectable) {
      actions.moveSelectedTo(x, y)
      return
    }
    actions.selectCell(x, y)
  }

  return (
    <div className="relative">
      <div className="absolute -top-10 right-0 text-xs text-white/60">2.5D View</div>
      <div className="mx-auto w-max p-6 rounded-xl bg-black/20">
        <div className="origin-center" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${map[0].length}, minmax(0, 1fr))` }}>
            {map.flat().map((cell) => {
              const stack = utils.unitsAt(cell.x, cell.y)
              const selectable = eligible.has(`${cell.x},${cell.y}`)
              const selected = stack.some((u) => u.id === selectedId)
              return (
                <BoardCell
                  key={`${cell.x}-${cell.y}`}
                  cell={cell}
                  onClick={handleCell(cell.x, cell.y, selectable)}
                  unitsHere={stack}
                  selectable={selectable}
                  selected={selected}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameBoard
