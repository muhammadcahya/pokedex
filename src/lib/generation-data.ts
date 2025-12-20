export interface GenerationInfo {
  id: number
  name: string
  region: string
  start: number
  end: number
}

export const GENERATIONS: Array<GenerationInfo> = [
  { id: 1, name: 'Generation 1', region: 'Kanto', start: 1, end: 151 },
  { id: 2, name: 'Generation 2', region: 'Johto', start: 152, end: 251 },
  { id: 3, name: 'Generation 3', region: 'Hoenn', start: 252, end: 386 },
  { id: 4, name: 'Generation 4', region: 'Sinnoh', start: 387, end: 493 },
  { id: 5, name: 'Generation 5', region: 'Unova', start: 494, end: 649 },
  { id: 6, name: 'Generation 6', region: 'Kalos', start: 650, end: 721 },
  { id: 7, name: 'Generation 7', region: 'Alola', start: 722, end: 809 },
  { id: 8, name: 'Generation 8', region: 'Galar', start: 810, end: 905 },
  { id: 9, name: 'Generation 9', region: 'Paldea', start: 906, end: 1025 },
]

export const TOTAL_POKEMON = 1025

export function getGenerationForPokemonId(
  id: number,
): GenerationInfo | undefined {
  return GENERATIONS.find((g) => id >= g.start && id <= g.end)
}

export function formatGeneration(gen: GenerationInfo): string {
  return `Generation ${gen.id} (${gen.region})`
}

export function formatGenerationShort(gen: GenerationInfo): string {
  return gen.region
}

export function getGenerationByRegion(
  region: string,
): GenerationInfo | undefined {
  return GENERATIONS.find(
    (g) => g.region.toLowerCase() === region.toLowerCase(),
  )
}

export function getGenerationById(id: number): GenerationInfo | undefined {
  return GENERATIONS.find((g) => g.id === id)
}

export function getPokemonIdsForGenerations(
  regions: Array<string>,
): Array<number> {
  if (regions.length === 0) return []

  const ids: Array<number> = []
  for (const region of regions) {
    const gen = getGenerationByRegion(region)
    if (gen) {
      for (let i = gen.start; i <= gen.end; i++) {
        ids.push(i)
      }
    }
  }
  return ids
}

export function isInGeneration(
  pokemonId: number,
  regions: Array<string>,
): boolean {
  if (regions.length === 0) return true
  const gen = getGenerationForPokemonId(pokemonId)
  if (!gen) return false
  return regions.some((r) => r.toLowerCase() === gen.region.toLowerCase())
}
