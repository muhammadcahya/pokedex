import type { NamedAPIResource } from './pokemon'

export interface EvolutionChain {
  id: number
  baby_trigger_item: NamedAPIResource | null
  chain: EvolutionLink
}

export interface EvolutionLink {
  is_baby: boolean
  species: NamedAPIResource
  evolution_details: Array<EvolutionDetail>
  evolves_to: Array<EvolutionLink>
}

export interface EvolutionDetail {
  item: NamedAPIResource | null
  trigger: NamedAPIResource
  gender: number | null
  held_item: NamedAPIResource | null
  known_move: NamedAPIResource | null
  known_move_type: NamedAPIResource | null
  location: NamedAPIResource | null
  min_level: number | null
  min_happiness: number | null
  min_beauty: number | null
  min_affection: number | null
  needs_overworld_rain: boolean
  party_species: NamedAPIResource | null
  party_type: NamedAPIResource | null
  relative_physical_stats: number | null
  time_of_day: string
  trade_species: NamedAPIResource | null
  turn_upside_down: boolean
}

// Flattened evolution for easier rendering
export interface FlatEvolution {
  id: number
  name: string
  sprite: string | null
  minLevel: number | null
  trigger: string
  item: string | null
}
