import { useMemo } from 'react'

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

function generateMap(cols = 35, rows = 24) {
  // Lightweight procedural-ish map
  const map = []
  for (let y = 0; y < rows; y++) {
    const row = []
    for (let x = 0; x < cols; x++) {
      const r = Math.random()
      let type = 'plains'
      if (r < 0.08) type = 'water'
      else if (r < 0.16) type = 'forest'
      else if (r < 0.22) type = 'mountain'
      row.push({ x, y, type })
    }
    map.push(row)
  }
  // Place corner bases
  map[0][0].base = 'blue'
  map[0][cols - 1].base = 'green'
  map[rows - 1][0].base = 'orange'
  map[rows - 1][cols - 1].base = 'purple'
  return map
}

function BoardCell({ cell }) {
  return (
    <div className={`relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-sm border border-black/30 ${tileClass(cell.type)} shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]`}>
      {cell.base && (
        <div className={`absolute inset-0 rounded-sm ring-2 ring-offset-0 ${
          cell.base === 'blue' ? 'ring-sky-400/80' :
          cell.base === 'green' ? 'ring-emerald-400/80' :
          cell.base === 'orange' ? 'ring-amber-400/80' :
          'ring-fuchsia-400/80'
        }`}></div>
      )}
      {cell.base && (
        <div className="absolute inset-0 flex items-center justify-center text-xs">⌂</div>
      )}
    </div>
  )
}

function GameBoard() {
  const map = useMemo(() => generateMap(), [])

  return (
    <div className="relative">
      <div className="absolute -top-10 right-0 text-xs text-white/60">2.5D View</div>
      <div className="mx-auto w-max p-6 rounded-xl bg-black/20">
        <div className="origin-center" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${map[0].length}, minmax(0, 1fr))` }}>
            {map.flat().map((cell, idx) => (
              <BoardCell key={`${cell.x}-${cell.y}-${idx}`} cell={cell} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameBoard
