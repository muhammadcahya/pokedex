// Static Pokemon data for fast filtering
// This data is pre-generated and bundled with the app for instant loading

// Import the minified JSON data
// import pokemonData from './pokemon-data.min.json'
const pokemonData = [
  {
    id: 1,
    name: 'bulbasaur',
    types: ['grass', 'poison'],
    height: 7,
    weight: 69,
    abilities: ['overgrow', 'chlorophyll'],
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  },
]

export interface PokemonBasicInfo {
  id: number
  name: string
  types: Array<string>
  height: number
  weight: number
  abilities: Array<string>
  sprite: string | null
}

export const ALL_POKEMON: Array<PokemonBasicInfo> =
  pokemonData as Array<PokemonBasicInfo>

// Helper to get Pokemon by ID
export function getPokemonById(id: number): PokemonBasicInfo | undefined {
  return ALL_POKEMON.find((p) => p.id === id)
}

// Helper to search Pokemon by name
export function searchPokemon(query: string): Array<PokemonBasicInfo> {
  const lowerQuery = query.toLowerCase()
  return ALL_POKEMON.filter(
    (p) => p.name.includes(lowerQuery) || p.id.toString().includes(lowerQuery),
  )
}
