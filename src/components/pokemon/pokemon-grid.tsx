import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery, useQueries } from '@tanstack/react-query'
import { PokemonCard, PokemonCardSkeleton } from './pokemon-card'
import {
  pokemonDetailsOptions,
  pokemonListInfiniteOptions,
} from '@/api/query-options'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/hooks/use-favorites'
import { useCompare } from '@/hooks/use-compare'
import { extractIdFromUrl } from '@/lib/pokemon-utils'
import { TOTAL_POKEMON } from '@/lib/generation-data'

interface PokemonGridProps {
  search?: string
  filterTypes?: Array<string>
}

export function PokemonGrid({
  search = '',
  filterTypes = [],
}: PokemonGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Track the previous filter state to detect filter changes
  const prevFilterTypesRef = useRef<Array<string>>([])
  const [filterStable, setFilterStable] = useState(true)

  const { toggleFavorite, isFavorite } = useFavorites()
  const { toggleCompare, isInCompare, canAddMore } = useCompare()

  // Infinite query for Pokemon list
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(pokemonListInfiniteOptions())

  // Get all Pokemon from all pages
  const allPokemon = data?.pages.flatMap((page) => page.results) ?? []

  // Fetch details for all Pokemon in current pages (for types)
  const pokemonDetailsQueries = useQueries({
    queries: allPokemon.map((pokemon) => {
      const id = extractIdFromUrl(pokemon.url)
      return {
        ...pokemonDetailsOptions(id),
        enabled: !!id,
      }
    }),
  })

  // Track if details are loading for current batch
  const loadedDetailsCount = pokemonDetailsQueries.filter(
    (q) => !q.isLoading && q.data,
  ).length
  const totalQueriesCount = pokemonDetailsQueries.length
  const allDetailsLoaded =
    totalQueriesCount > 0 && loadedDetailsCount === totalQueriesCount

  // Detect filter changes and mark as unstable until details are loaded
  useEffect(() => {
    const prevTypes = prevFilterTypesRef.current
    const currentTypes = filterTypes

    const filtersChanged =
      prevTypes.length !== currentTypes.length ||
      prevTypes.some((t, i) => t !== currentTypes[i])

    if (filtersChanged) {
      setFilterStable(false)
      prevFilterTypesRef.current = [...currentTypes]
    }
  }, [filterTypes])

  // Mark filter as stable once all details are loaded
  useEffect(() => {
    if (allDetailsLoaded && !filterStable) {
      setFilterStable(true)
    }
  }, [allDetailsLoaded, filterStable])

  // Build Pokemon list with details - memoized to prevent recalculations
  const pokemonWithDetails = useMemo(() => {
    return allPokemon
      .map((pokemon, index) => {
        const id = extractIdFromUrl(pokemon.url)
        const details = pokemonDetailsQueries[index]?.data
        return {
          id,
          name: pokemon.name,
          types: details?.types ?? [],
          isLoading: pokemonDetailsQueries[index]?.isLoading ?? true,
        }
      })
      .filter((pokemon) => {
        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase()
          const matchesName = pokemon.name.toLowerCase().includes(searchLower)
          const matchesId = String(pokemon.id).includes(search)
          if (!matchesName && !matchesId) return false
        }

        // Apply type filter - only filter Pokemon with loaded types
        if (filterTypes.length > 0) {
          // Skip Pokemon without loaded types
          if (pokemon.types.length === 0) {
            return false
          }
          const pokemonTypes = pokemon.types.map((t) => t.type.name)
          const hasAllTypes = filterTypes.every((type) =>
            pokemonTypes.includes(type),
          )
          if (!hasAllTypes) return false
        }

        return true
      })
  }, [allPokemon, pokemonDetailsQueries, search, filterTypes])

  // Calculate showing count
  const showingCount = pokemonWithDetails.length
  const totalCount = TOTAL_POKEMON

  // Check if we're actively filtering (type filter is active)
  const hasTypeFilter = filterTypes.length > 0
  // Only show loading state when filter just changed and details not loaded yet
  const isFilterLoading = hasTypeFilter && !filterStable

  // Intersection observer for infinite scroll - DISABLED when type filter is active
  const handleObserver = useCallback(
    (entries: Array<IntersectionObserverEntry>) => {
      const [entry] = entries
      // Only auto-fetch if NO type filter is active
      if (
        entry.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        !hasTypeFilter
      ) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, hasTypeFilter],
  )

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    })

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [handleObserver])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">Loading Pokemon...</div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <PokemonCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Empty>
        <EmptyTitle>Failed to load Pokemon</EmptyTitle>
        <EmptyDescription>
          There was an error loading the Pokemon list. Please try again.
        </EmptyDescription>
      </Empty>
    )
  }

  // Show loading state when filter just changed
  if (isFilterLoading) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Spinner className="size-4" />
          <span>Filtering by type...</span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <PokemonCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (pokemonWithDetails.length === 0) {
    return (
      <Empty>
        <EmptyTitle>No Pokemon found</EmptyTitle>
        <EmptyDescription>
          {search || hasTypeFilter
            ? 'Try adjusting your search or filters'
            : 'No Pokemon available'}
        </EmptyDescription>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-muted-foreground text-sm">
        Showing {showingCount} of {totalCount} Pokemon
        {hasTypeFilter && ' (filtered)'}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {pokemonWithDetails.map((pokemon) =>
          pokemon.isLoading ? (
            <PokemonCardSkeleton key={pokemon.id} />
          ) : (
            <PokemonCard
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              types={pokemon.types}
              isFavorite={isFavorite(pokemon.id)}
              isInCompare={isInCompare(pokemon.id)}
              onFavoriteToggle={() => toggleFavorite(pokemon.id, pokemon.name)}
              onCompareToggle={() => toggleCompare(pokemon.id, pokemon.name)}
              canAddToCompare={canAddMore}
            />
          ),
        )}
      </div>

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2">
            <Spinner className="size-5" />
            <span className="text-muted-foreground text-sm">
              Loading more...
            </span>
          </div>
        )}

        {/* Manual load more button when type filter is active */}
        {hasTypeFilter && hasNextPage && !isFetchingNextPage && (
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            Load more Pokemon
          </Button>
        )}

        {!hasNextPage && allPokemon.length > 0 && (
          <span className="text-muted-foreground text-sm">
            You&apos;ve seen all {totalCount} Pokemon!
          </span>
        )}
      </div>
    </div>
  )
}
