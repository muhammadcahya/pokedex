import type { APIResource, NamedAPIResource } from './pokemon'

export interface PokemonSpecies {
  id: number
  name: string
  order: number
  gender_rate: number
  capture_rate: number
  base_happiness: number
  is_baby: boolean
  is_legendary: boolean
  is_mythical: boolean
  hatch_counter: number
  has_gender_differences: boolean
  forms_switchable: boolean
  growth_rate: NamedAPIResource
  pokedex_numbers: Array<PokedexNumber>
  egg_groups: Array<NamedAPIResource>
  color: NamedAPIResource
  shape: NamedAPIResource
  evolves_from_species: NamedAPIResource | null
  evolution_chain: APIResource
  habitat: NamedAPIResource | null
  generation: NamedAPIResource
  names: Array<SpeciesName>
  flavor_text_entries: Array<FlavorTextEntry>
  form_descriptions: Array<FormDescription>
  genera: Array<Genus>
  varieties: Array<PokemonVariety>
}

export interface PokedexNumber {
  entry_number: number
  pokedex: NamedAPIResource
}

export interface SpeciesName {
  name: string
  language: NamedAPIResource
}

export interface FlavorTextEntry {
  flavor_text: string
  language: NamedAPIResource
  version: NamedAPIResource
}

export interface FormDescription {
  description: string
  language: NamedAPIResource
}

export interface Genus {
  genus: string
  language: NamedAPIResource
}

export interface PokemonVariety {
  is_default: boolean
  pokemon: NamedAPIResource
}

// Generation details
export interface Generation {
  id: number
  name: string
  abilities: Array<NamedAPIResource>
  main_region: NamedAPIResource
  moves: Array<NamedAPIResource>
  names: Array<GenerationName>
  pokemon_species: Array<NamedAPIResource>
  types: Array<NamedAPIResource>
  version_groups: Array<NamedAPIResource>
}

export interface GenerationName {
  name: string
  language: NamedAPIResource
}
