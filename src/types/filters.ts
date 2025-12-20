import type { PokemonTypeName } from './pokemon'

export interface FilterState {
  search: string
  regions: Array<string>
  types: Array<PokemonTypeName>
  ability: string | null
  height: HeightFilter
  weight: WeightFilter
  sort: SortOption
}

export type HeightFilter = 'all' | 'small' | 'medium' | 'large'
export type WeightFilter = 'all' | 'light' | 'medium' | 'heavy'
export type SortOption = 'number' | 'name' | 'random'

export interface SearchParams {
  search?: string
  regions?: string
  types?: string
  ability?: string
  height?: HeightFilter
  weight?: WeightFilter
  sort?: SortOption
  page?: number
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
