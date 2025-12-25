// PokeAPI Pokemon response types

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<PokemonListItem>
}

export interface PokemonListItem {
  name: string
  url: string
}

export interface Pokemon {
  id: number
  name: string
  height: number // In decimeters
  weight: number // In hectograms
  base_experience: number
  is_default: boolean
  order: number
  sprites: PokemonSprites
  types: Array<PokemonType>
  stats: Array<PokemonStat>
  abilities: Array<PokemonAbility>
  cries: PokemonCries
  species: NamedAPIResource
  forms: Array<NamedAPIResource>
  moves: Array<PokemonMove>
  held_items: Array<PokemonHeldItem>
}

export interface PokemonHeldItem {
  item: NamedAPIResource
  version_details: Array<PokemonHeldItemVersion>
}

export interface PokemonHeldItemVersion {
  version: NamedAPIResource
  rarity: number
}

export interface PokemonSprites {
  front_default: string | null
  front_shiny: string | null
  front_female: string | null
  front_shiny_female: string | null
  back_default: string | null
  back_shiny: string | null
  back_female: string | null
  back_shiny_female: string | null
  other: {
    'official-artwork': {
      front_default: string | null
      front_shiny: string | null
    }
    dream_world: {
      front_default: string | null
      front_female: string | null
    }
    home: {
      front_default: string | null
      front_female: string | null
      front_shiny: string | null
      front_shiny_female: string | null
    }
  }
}

export interface PokemonType {
  slot: number
  type: NamedAPIResource
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: NamedAPIResource
}

export interface PokemonAbility {
  ability: NamedAPIResource
  is_hidden: boolean
  slot: number
}

export interface PokemonCries {
  latest: string
  legacy: string
}

export interface PokemonMove {
  move: NamedAPIResource
  version_group_details: Array<PokemonMoveVersion>
}

export interface PokemonMoveVersion {
  level_learned_at: number
  move_learn_method: NamedAPIResource
  version_group: NamedAPIResource
}

export interface NamedAPIResource {
  name: string
  url: string
}

export interface APIResource {
  url: string
}

// Type details with damage relations
export interface TypeDetails {
  id: number
  name: string
  damage_relations: TypeDamageRelations
  pokemon: Array<TypePokemon>
  moves: Array<NamedAPIResource>
  generation: NamedAPIResource
}

export interface TypeDamageRelations {
  no_damage_to: Array<NamedAPIResource>
  half_damage_to: Array<NamedAPIResource>
  double_damage_to: Array<NamedAPIResource>
  no_damage_from: Array<NamedAPIResource>
  half_damage_from: Array<NamedAPIResource>
  double_damage_from: Array<NamedAPIResource>
}

export interface TypePokemon {
  slot: number
  pokemon: NamedAPIResource
}

// Ability details
export interface AbilityDetails {
  id: number
  name: string
  is_main_series: boolean
  generation: NamedAPIResource
  names: Array<AbilityName>
  effect_entries: Array<AbilityEffectEntry>
  flavor_text_entries: Array<AbilityFlavorText>
  pokemon: Array<AbilityPokemon>
}

export interface AbilityName {
  name: string
  language: NamedAPIResource
}

export interface AbilityEffectEntry {
  effect: string
  short_effect: string
  language: NamedAPIResource
}

export interface AbilityFlavorText {
  flavor_text: string
  language: NamedAPIResource
  version_group: NamedAPIResource
}

export interface AbilityPokemon {
  is_hidden: boolean
  slot: number
  pokemon: NamedAPIResource
}

// All types
export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'
