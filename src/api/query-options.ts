import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import {
  getAbilityDetails,
  getAllAbilities,
  getAllTypes,
  getEvolutionChain,
  getGeneration,
  getPokemonBatch,
  getPokemonDetails,
  getPokemonList,
  getPokemonPageWithDetails,
  getPokemonSpecies,
  getTypeDetails,
} from './server-functions'
import { CACHE_TIMES, DEFAULT_PAGE_SIZE, MAX_POKEMON } from '@/lib/constants'

// Infinite query for Pokemon list (for infinite scroll)
export const pokemonListInfiniteOptions = () =>
  infiniteQueryOptions({
    queryKey: ['pokemon-list-infinite'],
    queryFn: ({ pageParam = 0 }) =>
      getPokemonList({ data: { limit: DEFAULT_PAGE_SIZE, offset: pageParam } }),
    initialPageParam: 0,
    getNextPageParam: (_lastPage, allPages) => {
      const nextOffset = allPages.length * DEFAULT_PAGE_SIZE
      return nextOffset < MAX_POKEMON ? nextOffset : undefined
    },
    staleTime: CACHE_TIMES.pokemonList,
  })

// Standard paginated list query
export const pokemonListOptions = (
  limit: number = DEFAULT_PAGE_SIZE,
  offset: number = 0,
) =>
  queryOptions({
    queryKey: ['pokemon-list', { limit, offset }],
    queryFn: () => getPokemonList({ data: { limit, offset } }),
    staleTime: CACHE_TIMES.pokemonList,
  })

// Full Pokemon list (for filtering)
export const fullPokemonListOptions = () =>
  queryOptions({
    queryKey: ['pokemon-list-full'],
    queryFn: () => getPokemonList({ data: { limit: MAX_POKEMON, offset: 0 } }),
    staleTime: CACHE_TIMES.pokemonList,
  })

// Pokemon details by ID or name
export const pokemonDetailsOptions = (idOrName: string | number) =>
  queryOptions({
    queryKey: ['pokemon-details', idOrName],
    queryFn: () => getPokemonDetails({ data: { idOrName } }),
    staleTime: CACHE_TIMES.pokemonDetails,
    enabled: !!idOrName,
  })

// Pokemon species data
export const pokemonSpeciesOptions = (idOrName: string | number) =>
  queryOptions({
    queryKey: ['pokemon-species', idOrName],
    queryFn: () => getPokemonSpecies({ data: { idOrName } }),
    staleTime: CACHE_TIMES.species,
    enabled: !!idOrName,
  })

// Evolution chain
export const evolutionChainOptions = (chainId: number) =>
  queryOptions({
    queryKey: ['evolution-chain', chainId],
    queryFn: () => getEvolutionChain({ data: { chainId } }),
    staleTime: CACHE_TIMES.evolutionChain,
    enabled: !!chainId,
  })

// Type details (for weaknesses)
export const typeDetailsOptions = (typeName: string) =>
  queryOptions({
    queryKey: ['type-details', typeName],
    queryFn: () => getTypeDetails({ data: { typeName } }),
    staleTime: CACHE_TIMES.typeDetails,
    enabled: !!typeName,
  })

// Generation details
export const generationOptions = (idOrName: string | number) =>
  queryOptions({
    queryKey: ['generation', idOrName],
    queryFn: () => getGeneration({ data: { idOrName } }),
    staleTime: CACHE_TIMES.typeDetails,
    enabled: !!idOrName,
  })

// Ability details
export const abilityDetailsOptions = (idOrName: string | number) =>
  queryOptions({
    queryKey: ['ability-details', idOrName],
    queryFn: () => getAbilityDetails({ data: { idOrName } }),
    staleTime: CACHE_TIMES.abilities,
    enabled: !!idOrName,
  })

// All abilities list (for filter dropdown)
export const allAbilitiesOptions = () =>
  queryOptions({
    queryKey: ['all-abilities'],
    queryFn: () => getAllAbilities(),
    staleTime: CACHE_TIMES.abilities,
  })

// All types list
export const allTypesOptions = () =>
  queryOptions({
    queryKey: ['all-types'],
    queryFn: () => getAllTypes(),
    staleTime: CACHE_TIMES.typeDetails,
  })

// Batch Pokemon details
export const pokemonBatchOptions = (ids: Array<number>) =>
  queryOptions({
    queryKey: ['pokemon-batch', ids],
    queryFn: () => getPokemonBatch({ data: { ids } }),
    staleTime: CACHE_TIMES.pokemonDetails,
    enabled: ids.length > 0,
  })

// Infinite query for Pokemon with details (for filtering and grid display)
export const pokemonWithDetailsInfiniteOptions = (pageSize: number = 40) =>
  infiniteQueryOptions({
    queryKey: ['pokemon-with-details-infinite', pageSize],
    queryFn: ({ pageParam = 0 }) =>
      getPokemonPageWithDetails({
        data: { limit: pageSize, offset: pageParam },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    staleTime: CACHE_TIMES.pokemonList,
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  })
