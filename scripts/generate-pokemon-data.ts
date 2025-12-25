/**
 * Script to generate static Pokemon data for fast filtering
 * Run with: bun run scripts/generate-pokemon-data.ts
 */

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'
const TOTAL_POKEMON = 1025
const BATCH_SIZE = 50

interface PokemonBasicInfo {
  id: number
  name: string
  types: Array<string>
  height: number
  weight: number
  abilities: Array<string>
  sprite: string
}

async function fetchPokemon(id: number): Promise<PokemonBasicInfo | null> {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`)
    if (!response.ok) return null

    const pokemon = await response.json()
    return {
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map((t: { type: { name: string } }) => t.type.name),
      height: pokemon.height,
      weight: pokemon.weight,
      abilities: pokemon.abilities.map(
        (a: { ability: { name: string } }) => a.ability.name,
      ),
      sprite: pokemon.sprites.front_default,
    }
  } catch {
    console.error(`Failed to fetch Pokemon ${id}`)
    return null
  }
}

async function generateData() {
  console.log(`Fetching ${TOTAL_POKEMON} Pokemon...`)
  const allPokemon: Array<PokemonBasicInfo> = []

  for (let offset = 0; offset < TOTAL_POKEMON; offset += BATCH_SIZE) {
    const batchSize = Math.min(BATCH_SIZE, TOTAL_POKEMON - offset)
    const batchPromises = Array.from({ length: batchSize }, (_, i) =>
      fetchPokemon(offset + i + 1),
    )

    const batchResults = await Promise.all(batchPromises)
    const validResults = batchResults.filter(
      (p): p is PokemonBasicInfo => p !== null,
    )
    allPokemon.push(...validResults)

    console.log(`Progress: ${allPokemon.length}/${TOTAL_POKEMON}`)
  }

  // Write to file
  const outputPath = './src/data/pokemon-data.json'
  await Bun.write(outputPath, JSON.stringify(allPokemon, null, 2))
  console.log(`\nGenerated ${outputPath} with ${allPokemon.length} Pokemon`)

  // Also create a minified version for production
  const minifiedPath = './src/data/pokemon-data.min.json'
  await Bun.write(minifiedPath, JSON.stringify(allPokemon))
  console.log(`Generated ${minifiedPath} (minified)`)
}

generateData().catch(console.error)
