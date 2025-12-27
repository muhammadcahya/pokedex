import { createServerFn } from '@tanstack/react-start'
import type { ParsedFilterState } from '@/lib/schemas/search'
import type {
  AbilityDetails,
  Pokemon,
  PokemonListResponse,
  TypeDetails,
} from '@/types/pokemon'
import type { Generation, PokemonSpecies } from '@/types/species'
import type { EvolutionChain } from '@/types/evolution'
import { POKEAPI_BASE_URL } from '@/lib/constants'

// Get paginated list of Pokemon
export const getPokemonList = createServerFn({ method: 'GET' })
  .inputValidator((data: { limit?: number; offset?: number }) => data)
  .handler(async ({ data }) => {
    const limit = data.limit ?? 20
    const offset = data.offset ?? 0

    const response = await fetch(
      `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon list: ${response.status}`)
    }

    return response.json() as Promise<PokemonListResponse>
  })

// Get Pokemon details by ID or name
export const getPokemonDetails = createServerFn({ method: 'GET' })
  .inputValidator((data: { idOrName: string | number }) => data)
  .handler(async ({ data }) => {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${data.idOrName}`)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Pokemon ${data.idOrName}: ${response.status}`,
      )
    }

    return response.json() as Promise<Pokemon>
  })

// Get Pokemon species data (for description, generation, evolution chain)
export const getPokemonSpecies = createServerFn({ method: 'GET' })
  .inputValidator((data: { idOrName: string | number }) => data)
  .handler(async ({ data }) => {
    const response = await fetch(
      `${POKEAPI_BASE_URL}/pokemon-species/${data.idOrName}`,
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch species ${data.idOrName}: ${response.status}`,
      )
    }

    return response.json() as Promise<PokemonSpecies>
  })

// Get evolution chain by chain ID
export const getEvolutionChain = createServerFn({ method: 'GET' })
  .inputValidator((data: { chainId: number }) => data)
  .handler(async ({ data }) => {
    const response = await fetch(
      `${POKEAPI_BASE_URL}/evolution-chain/${data.chainId}`,
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch evolution chain ${data.chainId}: ${response.status}`,
      )
    }

    return response.json() as Promise<EvolutionChain>
  })

// Get type details (for damage relations/weaknesses)
export const getTypeDetails = createServerFn({ method: 'GET' })
  .inputValidator((data: { typeName: string }) => data)
  .handler(async ({ data }) => {
    const response = await fetch(`${POKEAPI_BASE_URL}/type/${data.typeName}`)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch type ${data.typeName}: ${response.status}`,
      )
    }

    return response.json() as Promise<TypeDetails>
  })

// Get generation details
export const getGeneration = createServerFn({ method: 'GET' })
  .inputValidator((data: { idOrName: string | number }) => data)
  .handler(async ({ data }) => {
    const response = await fetch(
      `${POKEAPI_BASE_URL}/generation/${data.idOrName}`,
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch generation ${data.idOrName}: ${response.status}`,
      )
    }

    return response.json() as Promise<Generation>
  })

// Get ability details
export const getAbilityDetails = createServerFn({ method: 'GET' })
  .inputValidator((data: { idOrName: string | number }) => data)
  .handler(async ({ data }) => {
    const response = await fetch(`${POKEAPI_BASE_URL}/ability/${data.idOrName}`)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ability ${data.idOrName}: ${response.status}`,
      )
    }

    return response.json() as Promise<AbilityDetails>
  })

// Get all abilities for filter dropdown
export const getAllAbilities = createServerFn({ method: 'GET' }).handler(
  async () => {
    const response = await fetch(`${POKEAPI_BASE_URL}/ability?limit=400`)

    if (!response.ok) {
      throw new Error(`Failed to fetch abilities: ${response.status}`)
    }

    return response.json() as Promise<PokemonListResponse>
  },
)

// Get all types
export const getAllTypes = createServerFn({ method: 'GET' }).handler(
  async () => {
    const response = await fetch(`${POKEAPI_BASE_URL}/type`)

    if (!response.ok) {
      throw new Error(`Failed to fetch types: ${response.status}`)
    }

    return response.json() as Promise<PokemonListResponse>
  },
)

// Batch fetch multiple Pokemon details
export const getPokemonBatch = createServerFn({ method: 'GET' })
  .inputValidator((data: { ids: Array<number> }) => data)
  .handler(async ({ data }) => {
    const promises = data.ids.map(async (id) => {
      const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`)
      if (!response.ok) return null
      return response.json() as Promise<Pokemon>
    })

    const results = await Promise.all(promises)
    return results.filter((p): p is Pokemon => p !== null)
  })

// Basic Pokemon info for filtering (lightweight)
export interface PokemonBasicInfo {
  id: number
  name: string
  types: Array<string>
  height: number
  weight: number
  abilities: Array<string>
  sprite: string | null
}

// Paginated Pokemon with details - fetches a page of Pokemon with their basic info
export const getPokemonPageWithDetails = createServerFn({ method: 'GET' })
  .inputValidator((data: { limit: number; offset: number }) => data)
  .handler(async ({ data }) => {
    const { limit, offset } = data

    // Fetch Pokemon details in parallel for this page
    const ids = Array.from({ length: limit }, (_, i) => offset + i + 1).filter(
      (id) => id <= 1025,
    )

    const pokemonPromises = ids.map(async (id) => {
      try {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`)
        if (!response.ok) return null
        const pokemon = (await response.json()) as Pokemon
        return {
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types.map((t) => t.type.name),
          height: pokemon.height,
          weight: pokemon.weight,
          abilities: pokemon.abilities.map((a) => a.ability.name),
          sprite: pokemon.sprites.front_default,
        } as PokemonBasicInfo
      } catch {
        return null
      }
    })

    const results = await Promise.all(pokemonPromises)
    const pokemon = results.filter((p): p is PokemonBasicInfo => p !== null)

    return {
      pokemon,
      nextOffset: offset + limit <= 1025 ? offset + limit : null,
      total: 1025,
    }
  })

// Helper to extract ID from PokeAPI URL
function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  return match ? parseInt(match[1], 10) : 0
}

// Get all Pokemon IDs for a specific type
export const getPokemonIdsByType = createServerFn({ method: 'GET' })
  .inputValidator((data: { type: string }) => data)
  .handler(async ({ data }) => {
    const response = await fetch(`${POKEAPI_BASE_URL}/type/${data.type}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch type ${data.type}: ${response.status}`)
    }

    const typeData = (await response.json()) as TypeDetails
    // Filter to only include Pokemon with id <= 1025 (main Pokemon, not forms)
    return typeData.pokemon
      .map((p) => extractIdFromUrl(p.pokemon.url))
      .filter((id) => id > 0 && id <= 1025)
      .sort((a, b) => a - b)
  })

// Get all Pokemon IDs for a specific generation
export const getPokemonIdsByGeneration = createServerFn({ method: 'GET' })
  .inputValidator((data: { generation: number }) => data)
  .handler(async ({ data }) => {
    const response = await fetch(
      `${POKEAPI_BASE_URL}/generation/${data.generation}`,
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch generation ${data.generation}: ${response.status}`,
      )
    }

    const genData = (await response.json()) as Generation
    // pokemon_species contains the species in this generation
    return genData.pokemon_species
      .map((p) => extractIdFromUrl(p.url))
      .filter((id) => id > 0 && id <= 1025)
      .sort((a, b) => a - b)
  })

// Batch fetch Pokemon basic info by IDs (for paginated display)
export const getPokemonBasicInfoBatch = createServerFn({ method: 'GET' })
  .inputValidator((data: { ids: Array<number> }) => data)
  .handler(async ({ data }) => {
    const pokemonPromises = data.ids.map(async (id) => {
      try {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`)
        if (!response.ok) return null
        const pokemon = (await response.json()) as Pokemon
        return {
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types.map((t) => t.type.name),
          height: pokemon.height,
          weight: pokemon.weight,
          abilities: pokemon.abilities.map((a) => a.ability.name),
          sprite: pokemon.sprites.front_default,
        } as PokemonBasicInfo
      } catch {
        return null
      }
    })

    const results = await Promise.all(pokemonPromises)
    return results.filter((p): p is PokemonBasicInfo => p !== null)
  })

// Response type for echo search params
export interface EchoSearchResponse {
  receivedAt: string
  processingTime: number
  filters: ParsedFilterState
  summary: {
    totalFiltersActive: number
    searchTerm: string | null
    selectedTypes: Array<string>
    selectedRegions: Array<string>
    hasRangeFilter: boolean
    hasBooleanFilters: boolean
  }
  serverInfo: {
    nodeVersion: string
    timestamp: number
  }
}

// Echo search params back with simulated delay (for demo purposes)
export const echoSearchParams = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { filters: ParsedFilterState; delay?: number }) => data,
  )
  .handler(async ({ data }) => {
    const startTime = Date.now()

    // Simulate network/processing delay (default 800ms, max 3000ms)
    const delay = Math.min(data.delay ?? 800, 3000)
    await new Promise((resolve) => setTimeout(resolve, delay))

    const processingTime = Date.now() - startTime

    // Count active filters
    let totalFiltersActive = 0
    if (data.filters.search) totalFiltersActive++
    totalFiltersActive += data.filters.types.length
    totalFiltersActive += data.filters.regions.length
    if (data.filters.height !== 'all') totalFiltersActive++
    if (data.filters.weight !== 'all') totalFiltersActive++
    if (data.filters.legendaryOnly) totalFiltersActive++
    if (data.filters.hasEvolution) totalFiltersActive++
    if (data.filters.minStats !== null) totalFiltersActive++
    if (data.filters.statRange[0] !== 0 || data.filters.statRange[1] !== 720)
      totalFiltersActive++

    const response: EchoSearchResponse = {
      receivedAt: new Date().toISOString(),
      processingTime,
      filters: data.filters,
      summary: {
        totalFiltersActive,
        searchTerm: data.filters.search || null,
        selectedTypes: data.filters.types,
        selectedRegions: data.filters.regions,
        hasRangeFilter:
          data.filters.statRange[0] !== 0 || data.filters.statRange[1] !== 720,
        hasBooleanFilters:
          data.filters.legendaryOnly || data.filters.hasEvolution,
      },
      serverInfo: {
        nodeVersion: process.version,
        timestamp: Date.now(),
      },
    }

    return response
  })
