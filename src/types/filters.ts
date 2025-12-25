import type { PokemonTypeName } from './pokemon'

export type SortOption =
  | 'number-asc'
  | 'number-desc'
  | 'name-asc'
  | 'name-desc'
  | 'height-asc'
  | 'height-desc'
  | 'weight-asc'
  | 'weight-desc'
  | 'random'

export type HeightFilter = 'all' | 'small' | 'medium' | 'large'
export type WeightFilter = 'all' | 'light' | 'medium' | 'heavy'

export interface FilterState {
  search: string
  regions: Array<string>
  types: Array<PokemonTypeName>
  ability: string
  height: HeightFilter
  weight: WeightFilter
  sort: SortOption
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  regions: [],
  types: [],
  ability: '',
  height: 'all',
  weight: 'all',
  sort: 'number-asc',
}

export interface SearchParams {
  search?: string
  regions?: string
  types?: string
  ability?: string
  height?: HeightFilter
  weight?: WeightFilter
  sort?: SortOption
}

// Height ranges in meters (Pokemon API uses decimeters)
export const HEIGHT_RANGES = {
  small: { max: 10 }, // < 1m (10 decimeters)
  medium: { min: 10, max: 20 }, // 1-2m
  large: { min: 20 }, // > 2m
} as const

// Weight ranges in kg (Pokemon API uses hectograms)
export const WEIGHT_RANGES = {
  light: { max: 500 }, // < 50kg (500 hectograms)
  medium: { min: 500, max: 1000 }, // 50-100kg
  heavy: { min: 1000 }, // > 100kg
} as const

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'number-asc', label: 'Lowest Number' },
  { value: 'number-desc', label: 'Highest Number' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'height-asc', label: 'Height (Short to Tall)' },
  { value: 'height-desc', label: 'Height (Tall to Short)' },
  { value: 'weight-asc', label: 'Weight (Light to Heavy)' },
  { value: 'weight-desc', label: 'Weight (Heavy to Light)' },
  { value: 'random', label: 'Random' },
]

export const HEIGHT_OPTIONS: Array<{ value: HeightFilter; label: string }> = [
  { value: 'all', label: 'All Heights' },
  { value: 'small', label: 'Small (< 1m)' },
  { value: 'medium', label: 'Medium (1-2m)' },
  { value: 'large', label: 'Large (> 2m)' },
]

export const WEIGHT_OPTIONS: Array<{ value: WeightFilter; label: string }> = [
  { value: 'all', label: 'All Weights' },
  { value: 'light', label: 'Light (< 50kg)' },
  { value: 'medium', label: 'Medium (50-100kg)' },
  { value: 'heavy', label: 'Heavy (> 100kg)' },
]
