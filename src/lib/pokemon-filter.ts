import type { PokemonBasicInfo } from '@/api/server-functions'
import type { FilterState } from '@/types/filters'
import { HEIGHT_RANGES, WEIGHT_RANGES } from '@/types/filters'

// Apply client-side filters to Pokemon list
// These filters require the full Pokemon data (search, height, weight, ability)
export function applyClientFilters(
  pokemon: Array<PokemonBasicInfo>,
  filters: FilterState,
): Array<PokemonBasicInfo> {
  let result = pokemon

  // Search filter - matches name or padded ID
  if (filters.search) {
    const searchLower = filters.search.toLowerCase().trim()
    result = result.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(searchLower)
      const matchesId = String(p.id).padStart(4, '0').includes(filters.search)
      const matchesIdExact = String(p.id) === filters.search
      return matchesName || matchesId || matchesIdExact
    })
  }

  // Ability filter
  if (filters.ability) {
    const abilityLower = filters.ability.toLowerCase()
    result = result.filter((p) =>
      p.abilities.some((a) => a.toLowerCase() === abilityLower),
    )
  }

  // Height filter
  if (filters.height !== 'all') {
    result = result.filter((p) => {
      switch (filters.height) {
        case 'small':
          return p.height < HEIGHT_RANGES.small.max
        case 'medium':
          return (
            p.height >= HEIGHT_RANGES.medium.min &&
            p.height < HEIGHT_RANGES.medium.max
          )
        case 'large':
          return p.height >= HEIGHT_RANGES.large.min
        default:
          return true
      }
    })
  }

  // Weight filter
  if (filters.weight !== 'all') {
    result = result.filter((p) => {
      switch (filters.weight) {
        case 'light':
          return p.weight < WEIGHT_RANGES.light.max
        case 'medium':
          return (
            p.weight >= WEIGHT_RANGES.medium.min &&
            p.weight < WEIGHT_RANGES.medium.max
          )
        case 'heavy':
          return p.weight >= WEIGHT_RANGES.heavy.min
        default:
          return true
      }
    })
  }

  return result
}

// Sort Pokemon list
export function sortPokemon(
  pokemon: Array<PokemonBasicInfo>,
  sort: FilterState['sort'],
): Array<PokemonBasicInfo> {
  const sorted = [...pokemon]

  switch (sort) {
    case 'number-asc':
      sorted.sort((a, b) => a.id - b.id)
      break
    case 'number-desc':
      sorted.sort((a, b) => b.id - a.id)
      break
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'height-asc':
      sorted.sort((a, b) => a.height - b.height)
      break
    case 'height-desc':
      sorted.sort((a, b) => b.height - a.height)
      break
    case 'weight-asc':
      sorted.sort((a, b) => a.weight - b.weight)
      break
    case 'weight-desc':
      sorted.sort((a, b) => b.weight - a.weight)
      break
    case 'random':
      // Use a seeded random for consistent results during a session
      sorted.sort(() => Math.random() - 0.5)
      break
  }

  return sorted
}

// Paginate an array of items
export function paginate<T>(
  items: Array<T>,
  page: number,
  pageSize: number,
): {
  items: Array<T>
  totalPages: number
  totalCount: number
  startIndex: number
  endIndex: number
} {
  const totalCount = items.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const startIndex = (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalCount)

  return {
    items: items.slice(startIndex, endIndex),
    totalPages,
    totalCount,
    startIndex,
    endIndex,
  }
}

// Intersect multiple arrays of IDs
export function intersectIds(...arrays: Array<Array<number>>): Array<number> {
  if (arrays.length === 0) return []
  if (arrays.length === 1) return arrays[0]

  const sets = arrays.map((arr) => new Set(arr))
  const first = sets[0]

  return Array.from(first).filter((id) => sets.every((set) => set.has(id)))
}

// Union multiple arrays of IDs
export function unionIds(...arrays: Array<Array<number>>): Array<number> {
  const set = new Set<number>()
  for (const arr of arrays) {
    for (const id of arr) {
      set.add(id)
    }
  }
  return Array.from(set).sort((a, b) => a - b)
}
