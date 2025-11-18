import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

// Simple seeded RNG for deterministic procedural maps per refresh
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const TILE_TYPES = ['plains', 'forest', 'water', 'mountain', 'wood']
const COST = { plains: 1, forest: 2, wood: 1, mountain: 3, water: Infinity }

function generateMap(cols = 35, rows = 24, seed = 1337) {
  const rnd = mulberry32(seed)
  const map = []
  for (let y = 0; y < rows; y++) {
    const row = []
    for (let x = 0; x < cols; x++) {
      const r = rnd()
      let type = 'plains'
      if (r < 0.08) type = 'water'
      else if (r < 0.18) type = 'forest'
      else if (r < 0.24) type = 'mountain'
      else if (r < 0.28) type = 'wood' // docks/bridges
      row.push({ x, y, type })
    }
    map.push(row)
  }
  // Bases
  const colsLast = cols - 1
  const rowsLast = rows - 1
  map[0][0].base = 'blue'
  map[0][colsLast].base = 'green'
  map[rowsLast][0].base = 'orange'
  map[rowsLast][colsLast].base = 'purple'
  return map
}

const defaultPlayers = [
  { id: 'blue', name: 'Blue', color: 'sky', wood: 2, food: 3, incomeW: 1, incomeF: 1 },
  { id: 'green', name: 'Green', color: 'emerald', wood: 2, food: 2, incomeW: 1, incomeF: 1 },
  { id: 'orange', name: 'Orange', color: 'amber', wood: 1, food: 2, incomeW: 1, incomeF: 0 },
  { id: 'purple', name: 'Purple', color: 'fuchsia', wood: 3, food: 1, incomeW: 0, incomeF: 1 },
]

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [seed] = useState(() => Math.floor(Math.random() * 1000000))
  const [map] = useState(() => generateMap(35, 24, seed))
  const [players, setPlayers] = useState(defaultPlayers)
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0)
  const [units, setUnits] = useState(() => {
    // Spawn a worker at each base
    const u = []
    const bases = [
      { x: 0, y: 0, owner: 'blue' },
      { x: map[0].length - 1, y: 0, owner: 'green' },
      { x: 0, y: map.length - 1, owner: 'orange' },
      { x: map[0].length - 1, y: map.length - 1, owner: 'purple' },
    ]
    bases.forEach((b, i) => {
      u.push({ id: `u${i}`, type: 'Worker', hp: 3, mp: 3, maxMp: 3, owner: b.owner, x: b.x, y: b.y })
    })
    return u
  })
  const [selectedId, setSelectedId] = useState(null)
  const [eligible, setEligible] = useState(new Set())
  const [logs, setLogs] = useState([{ m: 'Welcome, strategist. Shape the world to your will.', t: 'System' }])
  const turnCounter = useRef(1)

  const currentPlayer = players[currentPlayerIdx]

  const inBounds = (x, y) => y >= 0 && y < map.length && x >= 0 && x < map[0].length

  const unitsAt = useCallback(
    (x, y) => units.filter((u) => u.x === x && u.y === y),
    [units]
  )

  const computeEligible = useCallback(
    (unit) => {
      const visited = new Map()
      const key = (x, y) => `${x},${y}`
      const q = [{ x: unit.x, y: unit.y, cost: 0 }]
      visited.set(key(unit.x, unit.y), 0)
      while (q.length) {
        const cur = q.shift()
        const dirs = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]
        for (const [dx, dy] of dirs) {
          const nx = cur.x + dx
          const ny = cur.y + dy
          if (!inBounds(nx, ny)) continue
          const tile = map[ny][nx]
          const step = COST[tile.type] ?? 1
          if (step === Infinity) continue
          const ncost = cur.cost + step
          if (ncost > unit.mp) continue
          const k = key(nx, ny)
          if (!visited.has(k) || ncost < visited.get(k)) {
            visited.set(k, ncost)
            q.push({ x: nx, y: ny, cost: ncost })
          }
        }
      }
      const set = new Set([...visited.keys()])
      set.delete(`${unit.x},${unit.y}`)
      return set
    },
    [map]
  )

  const selectUnit = useCallback(
    (id) => {
      setSelectedId(id)
      const unit = units.find((u) => u.id === id)
      if (!unit) return setEligible(new Set())
      if (unit.owner !== currentPlayer.id) {
        setEligible(new Set())
        return
      }
      setEligible(computeEligible(unit))
    },
    [computeEligible, currentPlayer?.id, units]
  )

  const selectCell = useCallback(
    (x, y) => {
      const stack = unitsAt(x, y)
      if (stack.length) {
        // Prefer selecting current player's unit on top of stack
        const own = stack.find((u) => u.owner === currentPlayer.id) || stack[0]
        selectUnit(own.id)
      }
    },
    [unitsAt, currentPlayer?.id, selectUnit]
  )

  const moveSelectedTo = useCallback(
    (x, y) => {
      if (!selectedId) return false
      const key = `${x},${y}`
      if (!eligible.has(key)) return false
      setUnits((prev) => {
        return prev.map((u) => {
          if (u.id !== selectedId) return u
          const tile = map[y][x]
          const step = COST[tile.type] ?? 1
          const mpLeft = Math.max(0, u.mp - step)
          return { ...u, x, y, mp: mpLeft }
        })
      })
      const unit = units.find((u) => u.id === selectedId)
      const tile = map[y][x]
      setLogs((l) => [{ t: unit.owner, m: `${unit.type} moved to (${x + 1},${y + 1}) on ${tile.type}` }, ...l])
      // Recompute eligible from new location
      const moved = { ...units.find((u) => u.id === selectedId), x, y }
      setEligible(computeEligible(moved))
      return true
    },
    [selectedId, eligible, units, map, computeEligible]
  )

  const endTurn = useCallback(() => {
    // Refill MP for current player's units and add income
    const pid = currentPlayer.id
    setUnits((prev) => prev.map((u) => (u.owner === pid ? { ...u, mp: u.maxMp } : u)))
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === pid ? { ...p, wood: p.wood + p.incomeW, food: p.food + p.incomeF } : p
      )
    )
    setSelectedId(null)
    setEligible(new Set())
    setCurrentPlayerIdx((i) => (i + 1) % players.length)
    turnCounter.current += 1
  }, [currentPlayer?.id, players.length])

  const recruit = useCallback(
    (type, ownerId) => {
      const p = players.find((x) => x.id === ownerId)
      if (!p) return
      // Cost system: Worker: 1 wood, Soldier: 1 wood 1 food, Catapult: 2 wood 1 food
      const cost =
        type === 'Worker' ? { wood: 1, food: 0 } : type === 'Soldier' ? { wood: 1, food: 1 } : { wood: 2, food: 1 }
      if (p.wood < cost.wood || p.food < cost.food) return
      // Spawn at base tile
      let bx = 0, by = 0
      outer: for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
          if (map[y][x].base === ownerId) {
            bx = x
            by = y
            break outer
          }
        }
      }
      setPlayers((prev) =>
        prev.map((pl) =>
          pl.id === ownerId ? { ...pl, wood: pl.wood - cost.wood, food: pl.food - cost.food } : pl
        )
      )
      setUnits((prev) => {
        const id = `u${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`
        const stats =
          type === 'Worker'
            ? { hp: 2, mp: 3, maxMp: 3 }
            : type === 'Soldier'
            ? { hp: 4, mp: 3, maxMp: 3 }
            : { hp: 3, mp: 2, maxMp: 2 }
        const nu = { id, type, owner: ownerId, x: bx, y: by, ...stats }
        return [...prev, nu]
      })
      setLogs((l) => [{ t: ownerId, m: `recruited a ${type}` }, ...l])
    },
    [map, players]
  )

  const value = useMemo(
    () => ({
      map,
      players,
      currentPlayer,
      currentPlayerIdx,
      turn: turnCounter.current,
      units,
      selectedId,
      eligible,
      logs,
      actions: { selectCell, selectUnit, moveSelectedTo, endTurn, recruit },
      utils: { unitsAt },
    }),
    [map, players, currentPlayer, currentPlayerIdx, units, selectedId, eligible, logs, selectCell, selectUnit, moveSelectedTo, endTurn, recruit, unitsAt]
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
