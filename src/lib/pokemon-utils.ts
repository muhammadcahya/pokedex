import type {
  Pokemon,
  PokemonTypeName,
  TypeDamageRelations,
} from '@/types/pokemon'
import type {
  EvolutionChain,
  EvolutionLink,
  FlatEvolution,
} from '@/types/evolution'

// Format Pokemon ID with leading zeros (e.g., #0001)
export function formatPokemonId(id: number): string {
  return `#${id.toString().padStart(4, '0')}`
}

// Capitalize first letter of each word
export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Convert height from decimeters to meters
export function formatHeight(heightInDecimeters: number): string {
  const meters = heightInDecimeters / 10
  return `${meters.toFixed(1)} m`
}

// Convert weight from hectograms to kilograms
export function formatWeight(weightInHectograms: number): string {
  const kg = weightInHectograms / 10
  return `${kg.toFixed(1)} kg`
}

// Get sprite URL for list view (low quality)
export function getListSprite(pokemon: Pokemon): string {
  return (
    pokemon.sprites.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
  )
}

// Get sprite URL for detail view (high quality)
export function getDetailSprite(pokemon: Pokemon): string {
  return (
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
  )
}

// Get shiny sprite URL
export function getShinySprite(pokemon: Pokemon): string | null {
  return (
    pokemon.sprites.other['official-artwork'].front_shiny ||
    pokemon.sprites.front_shiny
  )
}

// Get sprite by Pokemon ID (for list when we don't have full Pokemon data)
export function getSpriteById(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

// Get official artwork by Pokemon ID
export function getArtworkById(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

// Extract Pokemon ID from URL (e.g., "https://pokeapi.co/api/v2/pokemon/1/" -> 1)
export function extractIdFromUrl(url: string): number {
  const matches = url.match(/\/(\d+)\/?$/)
  return matches ? parseInt(matches[1], 10) : 0
}

// Calculate total base stats
export function calculateTotalStats(pokemon: Pokemon): number {
  return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)
}

// Get stat value by name
export function getStatValue(pokemon: Pokemon, statName: string): number {
  const stat = pokemon.stats.find((s) => s.stat.name === statName)
  return stat ? stat.base_stat : 0
}

// Format stat name for display
export function formatStatName(name: string): string {
  const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
  }
  return statNames[name] || name
}

// Calculate weaknesses from type damage relations
export function calculateWeaknesses(
  damageRelations: Array<TypeDamageRelations>,
): Array<PokemonTypeName> {
  const weaknessMultipliers = new Map<PokemonTypeName, number>()

  for (const relation of damageRelations) {
    // Double damage from these types
    for (const type of relation.double_damage_from) {
      const current = weaknessMultipliers.get(type.name as PokemonTypeName) || 1
      weaknessMultipliers.set(type.name as PokemonTypeName, current * 2)
    }

    // Half damage from these types
    for (const type of relation.half_damage_from) {
      const current = weaknessMultipliers.get(type.name as PokemonTypeName) || 1
      weaknessMultipliers.set(type.name as PokemonTypeName, current * 0.5)
    }

    // No damage from these types
    for (const type of relation.no_damage_from) {
      weaknessMultipliers.set(type.name as PokemonTypeName, 0)
    }
  }

  // Return types with multiplier >= 2
  return Array.from(weaknessMultipliers.entries())
    .filter(([, multiplier]) => multiplier >= 2)
    .map(([type]) => type)
}

// Flatten evolution chain for easier rendering
export function flattenEvolutionChain(
  chain: EvolutionChain,
): Array<FlatEvolution> {
  const evolutions: Array<FlatEvolution> = []

  function traverse(link: EvolutionLink) {
    const speciesId = extractIdFromUrl(link.species.url)
    const detail = link.evolution_details.at(0)

    evolutions.push({
      id: speciesId,
      name: link.species.name,
      sprite: getSpriteById(speciesId),
      minLevel: detail?.min_level ?? null,
      trigger: detail?.trigger.name ?? 'base',
      item: detail?.item?.name ?? null,
    })

    for (const next of link.evolves_to) {
      traverse(next)
    }
  }

  traverse(chain.chain)
  return evolutions
}

// Get random Pokemon ID
export function getRandomPokemonId(max: number = 1025): number {
  return Math.floor(Math.random() * max) + 1
}

// Check if height matches filter
export function matchesHeightFilter(
  heightInDecimeters: number,
  filter: 'all' | 'small' | 'medium' | 'large',
): boolean {
  if (filter === 'all') return true
  const height = heightInDecimeters
  switch (filter) {
    case 'small':
      return height < 10 // < 1m
    case 'medium':
      return height >= 10 && height < 20 // 1-2m
    case 'large':
      return height >= 20 // > 2m
    default:
      return true
  }
}

// Check if weight matches filter
export function matchesWeightFilter(
  weightInHectograms: number,
  filter: 'all' | 'light' | 'medium' | 'heavy',
): boolean {
  if (filter === 'all') return true
  const weight = weightInHectograms
  switch (filter) {
    case 'light':
      return weight < 500 // < 50kg
    case 'medium':
      return weight >= 500 && weight < 1000 // 50-100kg
    case 'heavy':
      return weight >= 1000 // > 100kg
    default:
      return true
  }
}
