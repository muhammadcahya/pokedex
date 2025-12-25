import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { PokemonCard, PokemonCardSkeleton } from './pokemon-card'
import type { FilterState } from '@/types/filters'
import type { PokemonBasicInfo } from '@/api/server-functions'
import { pokemonWithDetailsInfiniteOptions } from '@/api/query-options'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/contexts/favorites-context'
import { useCompare } from '@/contexts/compare-context'
import { TOTAL_POKEMON, isInGeneration } from '@/lib/generation-data'
import { HEIGHT_RANGES, WEIGHT_RANGES } from '@/types/filters'

interface PokemonGridProps {
  filters: FilterState
}

const PAGE_SIZE = 40

export function PokemonGrid({ filters }: PokemonGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { toggleFavorite, isFavorite } = useFavorites()
  const { toggleCompare, isInCompare, canAddMore } = useCompare()

  // Use infinite query for real paginated fetching from API
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(pokemonWithDetailsInfiniteOptions(PAGE_SIZE))

  // Flatten all pages into a single array
  const allLoadedPokemon = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => page.pokemon)
  }, [data])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.regions.length > 0 ||
      filters.types.length > 0 ||
      filters.ability !== '' ||
      filters.height !== 'all' ||
      filters.weight !== 'all'
    )
  }, [filters])

  // Filter and sort Pokemon (on loaded data)
  const filteredPokemon = useMemo(() => {
    let result = [...allLoadedPokemon]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter((pokemon) => {
        const matchesName = pokemon.name.toLowerCase().includes(searchLower)
        const matchesId = String(pokemon.id)
          .padStart(4, '0')
          .includes(filters.search)
        return matchesName || matchesId
      })
    }

    // Region filter
    if (filters.regions.length > 0) {
      result = result.filter((pokemon) =>
        isInGeneration(pokemon.id, filters.regions),
      )
    }

    // Type filter
    if (filters.types.length > 0) {
      result = result.filter((pokemon) =>
        filters.types.every((type) => pokemon.types.includes(type)),
      )
    }

    // Ability filter
    if (filters.ability) {
      result = result.filter((pokemon) =>
        pokemon.abilities.includes(filters.ability),
      )
    }

    // Height filter
    if (filters.height !== 'all') {
      result = result.filter((pokemon) => {
        const height = pokemon.height
        switch (filters.height) {
          case 'small':
            return height < HEIGHT_RANGES.small.max
          case 'medium':
            return (
              height >= HEIGHT_RANGES.medium.min &&
              height < HEIGHT_RANGES.medium.max
            )
          case 'large':
            return height >= HEIGHT_RANGES.large.min
          default:
            return true
        }
      })
    }

    // Weight filter
    if (filters.weight !== 'all') {
      result = result.filter((pokemon) => {
        const weight = pokemon.weight
        switch (filters.weight) {
          case 'light':
            return weight < WEIGHT_RANGES.light.max
          case 'medium':
            return (
              weight >= WEIGHT_RANGES.medium.min &&
              weight < WEIGHT_RANGES.medium.max
            )
          case 'heavy':
            return weight >= WEIGHT_RANGES.heavy.min
          default:
            return true
        }
      })
    }

    // Sort
    switch (filters.sort) {
      case 'number-asc':
        result.sort((a, b) => a.id - b.id)
        break
      case 'number-desc':
        result.sort((a, b) => b.id - a.id)
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'height-asc':
        result.sort((a, b) => a.height - b.height)
        break
      case 'height-desc':
        result.sort((a, b) => b.height - a.height)
        break
      case 'weight-asc':
        result.sort((a, b) => a.weight - b.weight)
        break
      case 'weight-desc':
        result.sort((a, b) => b.weight - a.weight)
        break
      case 'random':
        result.sort(() => Math.random() - 0.5)
        break
    }

    return result
  }, [allLoadedPokemon, filters])

  // Intersection observer for infinite scroll (only when not filtering)
  const handleObserver = useCallback(
    (entries: Array<IntersectionObserverEntry>) => {
      const [entry] = entries
      if (
        entry.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        !hasActiveFilters
      ) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage, hasActiveFilters],
  )

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    })

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [handleObserver])

  // Loading state (initial load only)
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Spinner className="size-5" />
            <span className="text-muted-foreground">Loading Pokemon...</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <PokemonCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  // Error state
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

  // Empty results
  if (filteredPokemon.length === 0) {
    return (
      <div className="space-y-4">
        <Empty>
          <EmptyTitle>No Pokemon found</EmptyTitle>
          <EmptyDescription>
            {hasActiveFilters && hasNextPage
              ? 'No matches in loaded Pokemon. Try loading more or adjusting your filters.'
              : "Try adjusting your search or filters to find what you're looking for."}
          </EmptyDescription>
        </Empty>
        {hasActiveFilters && hasNextPage && (
          <div className="flex justify-center">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Loading more...
                </>
              ) : (
                'Load More Pokemon'
              )}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>
          Showing {filteredPokemon.length}
          {hasActiveFilters && ` of ${allLoadedPokemon.length} loaded`}
          {!hasNextPage && ` of ${TOTAL_POKEMON} total`}
        </span>
        {hasActiveFilters && hasNextPage && (
          <span className="text-amber-600 dark:text-amber-400">
            Filtering {allLoadedPokemon.length} loaded Pokemon
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredPokemon.map((pokemon: PokemonBasicInfo) => (
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
        ))}
      </div>

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="flex flex-col items-center gap-4 py-4">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2">
            <Spinner className="size-5" />
            <span className="text-muted-foreground text-sm">
              Fetching more Pokemon...
            </span>
          </div>
        )}

        {hasNextPage && !isFetchingNextPage && (
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            Load More Pokemon ({allLoadedPokemon.length} / {TOTAL_POKEMON})
          </Button>
        )}

        {!hasNextPage && allLoadedPokemon.length > 0 && (
          <span className="text-muted-foreground text-sm">
            All {TOTAL_POKEMON} Pokemon loaded!
          </span>
        )}
      </div>
    </div>
  )
}
