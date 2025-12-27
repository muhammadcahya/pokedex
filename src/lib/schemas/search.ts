import { z } from 'zod'
import type { PokemonTypeName } from '@/types/pokemon'
import {
  HeightFilterSchema,
  SortOptionSchema,
  WeightFilterSchema,
} from '@/types/filters'

// Pokemon type schema (all 18 types)
export const PokemonTypeSchema = z.enum([
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
])

// Search params schema for TanStack Router URL validation
// Uses comma-separated strings for arrays (URL-friendly)
export const PokemonSearchSchema = z.object({
  // String
  search: z.string().optional(),
  // Array (comma-separated strings in URL)
  regions: z.string().optional(), // comma-separated: "Kanto,Johto"
  types: z.string().optional(), // comma-separated: "fire,water"
  // Enum
  height: HeightFilterSchema.optional(),
  weight: WeightFilterSchema.optional(),
  sort: SortOptionSchema.optional(),
  // Boolean - coerced from string "true"/"false" in URL
  legendaryOnly: z.coerce.boolean().optional(),
  hasEvolution: z.coerce.boolean().optional(),
  // Number - coerced from string in URL
  minStats: z.coerce.number().min(0).max(720).optional(),
  // Range - stored as "min-max" string in URL
  statRange: z.string().optional(), // format: "200-500"
})

export type PokemonSearchParams = z.infer<typeof PokemonSearchSchema>

// Parsed filter state (arrays instead of comma-separated strings)
export interface ParsedFilterState {
  // String
  search: string
  // Array
  regions: Array<string>
  types: Array<PokemonTypeName>
  // Enum
  height: 'all' | 'small' | 'medium' | 'large'
  weight: 'all' | 'light' | 'medium' | 'heavy'
  sort:
    | 'number-asc'
    | 'number-desc'
    | 'name-asc'
    | 'name-desc'
    | 'height-asc'
    | 'height-desc'
    | 'weight-asc'
    | 'weight-desc'
    | 'random'
  // Boolean
  legendaryOnly: boolean
  hasEvolution: boolean
  // Number
  minStats: number | null
  // Range (min-max tuple)
  statRange: readonly [number, number] | [number, number]
}

// Default range for base stats (0-720)
const DEFAULT_STAT_RANGE: [number, number] = [0, 720]

// Parse URL params to state
export function parseSearchParams(
  params: PokemonSearchParams,
): ParsedFilterState {
  // Parse statRange from "min-max" string format
  let statRange: [number, number] = DEFAULT_STAT_RANGE
  if (params.statRange) {
    const [min, max] = params.statRange.split('-').map(Number)
    if (!isNaN(min) && !isNaN(max)) {
      statRange = [Math.max(0, min), Math.min(720, max)]
    }
  }

  return {
    search: params.search ?? '',
    regions: params.regions ? params.regions.split(',').filter(Boolean) : [],
    types: params.types
      ? (params.types.split(',').filter(Boolean) as Array<PokemonTypeName>)
      : [],
    height: params.height ?? 'all',
    weight: params.weight ?? 'all',
    sort: params.sort ?? 'number-asc',
    legendaryOnly: params.legendaryOnly ?? false,
    hasEvolution: params.hasEvolution ?? false,
    minStats: params.minStats ?? null,
    statRange,
  }
}

// Serialize state back to URL params (removes defaults/empty values)
export function serializeSearchParams(
  state: Partial<ParsedFilterState>,
): PokemonSearchParams {
  // Only include statRange if it's not the default
  const isDefaultRange =
    !state.statRange || (state.statRange[0] === 0 && state.statRange[1] === 720)

  return {
    search: state.search || undefined,
    regions:
      state.regions && state.regions.length > 0
        ? state.regions.join(',')
        : undefined,
    types:
      state.types && state.types.length > 0 ? state.types.join(',') : undefined,
    height: state.height !== 'all' ? state.height : undefined,
    weight: state.weight !== 'all' ? state.weight : undefined,
    sort: state.sort !== 'number-asc' ? state.sort : undefined,
    legendaryOnly: state.legendaryOnly || undefined,
    hasEvolution: state.hasEvolution || undefined,
    minStats: state.minStats ?? undefined,
    statRange: isDefaultRange
      ? undefined
      : `${state.statRange![0]}-${state.statRange![1]}`,
  }
}

// Check if range is non-default
function isRangeActive(
  range: readonly [number, number] | [number, number],
): boolean {
  return range[0] !== 0 || range[1] !== 720
}

// Check if any filters are active
export function hasActiveFilters(state: ParsedFilterState): boolean {
  return (
    state.search !== '' ||
    state.regions.length > 0 ||
    state.types.length > 0 ||
    state.height !== 'all' ||
    state.weight !== 'all' ||
    state.legendaryOnly ||
    state.hasEvolution ||
    state.minStats !== null ||
    isRangeActive(state.statRange)
  )
}

// Count active filters
export function countActiveFilters(state: ParsedFilterState): number {
  let count = 0
  if (state.search) count++
  count += state.regions.length
  count += state.types.length
  if (state.height !== 'all') count++
  if (state.weight !== 'all') count++
  if (state.legendaryOnly) count++
  if (state.hasEvolution) count++
  if (state.minStats !== null) count++
  if (isRangeActive(state.statRange)) count++
  return count
}
