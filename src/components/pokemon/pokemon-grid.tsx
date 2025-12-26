import { useMemo } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { PokemonCard, PokemonCardSkeleton } from './pokemon-card'
import type { FilterState } from '@/types/filters'
import {
  pokemonBasicInfoBatchOptions,
  pokemonIdsByGenerationOptions,
  pokemonIdsByTypeOptions,
} from '@/api/query-options'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFavorites } from '@/hooks/use-favorites'
import { useCompare } from '@/hooks/use-compare'
import { TOTAL_POKEMON, getGenerationByRegion } from '@/lib/generation-data'
import {
  applyClientFilters,
  intersectIds,
  sortPokemon,
  unionIds,
} from '@/lib/pokemon-filter'
import { PAGE_SIZE_OPTIONS, hasActiveFilters } from '@/types/filters'

interface PokemonGridProps {
  filters: FilterState
  page: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export function PokemonGrid({
  filters,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: PokemonGridProps) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const { toggleCompare, isInCompare, canAddMore } = useCompare()

  // Get generation IDs for region filter queries
  const regionGenerationIds = useMemo(() => {
    return filters.regions
      .map((region) => getGenerationByRegion(region)?.id)
      .filter((id): id is number => id !== undefined)
  }, [filters.regions])

  // Fetch Pokemon IDs for each selected type
  const typeQueries = useQueries({
    queries: filters.types.map((type) => pokemonIdsByTypeOptions(type)),
  })

  // Fetch Pokemon IDs for each selected generation/region
  const generationQueries = useQueries({
    queries: regionGenerationIds.map((genId) =>
      pokemonIdsByGenerationOptions(genId),
    ),
  })

  // Check if type/generation queries are loading
  const isLoadingFilters =
    typeQueries.some((q) => q.isLoading) ||
    generationQueries.some((q) => q.isLoading)

  // Compute the base filtered ID list from API responses
  const baseFilteredIds = useMemo(() => {
    // Start with all Pokemon IDs
    let ids = Array.from({ length: TOTAL_POKEMON }, (_, i) => i + 1)

    // Apply type filter (intersection - Pokemon must have ALL selected types)
    if (filters.types.length > 0) {
      const typeIdSets = typeQueries
        .filter((q) => q.data)
        .map((q) => q.data as Array<number>)

      if (typeIdSets.length === filters.types.length) {
        ids = intersectIds(ids, ...typeIdSets)
      } else {
        // Still loading, return empty
        return []
      }
    }

    // Apply region filter (union - Pokemon can be in ANY selected region)
    if (filters.regions.length > 0) {
      const regionIdSets = generationQueries
        .filter((q) => q.data)
        .map((q) => q.data as Array<number>)

      if (regionIdSets.length === regionGenerationIds.length) {
        const regionIds = unionIds(...regionIdSets)
        ids = intersectIds(ids, regionIds)
      } else {
        // Still loading, return empty
        return []
      }
    }

    return ids.sort((a, b) => a - b)
  }, [
    filters.types,
    filters.regions,
    typeQueries,
    generationQueries,
    regionGenerationIds,
  ])

  // Calculate total pages and validate current page
  const totalBaseCount = baseFilteredIds.length
  const maxPage = Math.max(1, Math.ceil(totalBaseCount / limit))
  const safePage = Math.min(Math.max(1, page), maxPage)

  // Get the IDs for the current page
  const pageIds = useMemo(() => {
    const startIndex = (safePage - 1) * limit
    return baseFilteredIds.slice(startIndex, startIndex + limit)
  }, [baseFilteredIds, safePage, limit])

  // Fetch Pokemon details for current page
  const {
    data: pokemonData,
    isLoading: isLoadingPokemon,
    isError,
  } = useQuery({
    ...pokemonBasicInfoBatchOptions(pageIds),
    enabled: pageIds.length > 0 && !isLoadingFilters,
  })

  // Apply client-side filters (search, height, weight, ability) and sort
  const displayPokemon = useMemo(() => {
    if (!pokemonData) return []
    const filtered = applyClientFilters(pokemonData, filters)
    return sortPokemon(filtered, filters.sort)
  }, [pokemonData, filters])

  // Check if filters are active
  const filtersActive = hasActiveFilters(filters)

  // Calculate display counts
  const startIndex = (safePage - 1) * limit + 1
  const endIndex = Math.min(safePage * limit, totalBaseCount)

  // Generate pagination items
  const paginationItems = useMemo(() => {
    const items: Array<{ type: 'page' | 'ellipsis'; page?: number }> = []
    const totalPages = maxPage

    if (totalPages <= 7) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push({ type: 'page', page: i })
      }
    } else {
      // Show first, last, and pages around current
      items.push({ type: 'page', page: 1 })

      if (safePage > 3) {
        items.push({ type: 'ellipsis' })
      }

      const start = Math.max(2, safePage - 1)
      const end = Math.min(totalPages - 1, safePage + 1)

      for (let i = start; i <= end; i++) {
        items.push({ type: 'page', page: i })
      }

      if (safePage < totalPages - 2) {
        items.push({ type: 'ellipsis' })
      }

      items.push({ type: 'page', page: totalPages })
    }

    return items
  }, [maxPage, safePage])

  // Loading state
  if (isLoadingFilters || isLoadingPokemon) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Spinner className="size-5" />
            <span className="text-muted-foreground">Loading Pokemon...</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: Math.min(limit, 20) }).map((_, i) => (
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
        <Button onClick={() => onPageChange(1)} className="mt-4">
          Try Again
        </Button>
      </Empty>
    )
  }

  // Empty results (no Pokemon match the API filters)
  if (baseFilteredIds.length === 0) {
    return (
      <Empty>
        <EmptyTitle>No Pokemon found</EmptyTitle>
        <EmptyDescription>
          No Pokemon match your selected filters. Try adjusting your type or
          region filters.
        </EmptyDescription>
      </Empty>
    )
  }

  // Empty results after client-side filtering
  if (displayPokemon.length === 0 && pokemonData && pokemonData.length > 0) {
    return (
      <Empty>
        <EmptyTitle>No Pokemon match</EmptyTitle>
        <EmptyDescription>
          The Pokemon on this page don&apos;t match your search, ability,
          height, or weight filters. Try a different page or adjust your
          filters.
        </EmptyDescription>
        <div className="mt-4 flex gap-2">
          {safePage > 1 && (
            <Button
              variant="outline"
              onClick={() => onPageChange(safePage - 1)}
            >
              Previous Page
            </Button>
          )}
          {safePage < maxPage && (
            <Button
              variant="outline"
              onClick={() => onPageChange(safePage + 1)}
            >
              Next Page
            </Button>
          )}
        </div>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {/* Results info and page size selector */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-muted-foreground text-sm">
          Showing {startIndex}-{endIndex} of {totalBaseCount}
          {filtersActive && ` (filtered from ${TOTAL_POKEMON})`}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Per page:</span>
          <Select
            value={limit}
            onValueChange={(value) => {
              onLimitChange(Number(value))
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pokemon grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {displayPokemon.map((pokemon) => (
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

      {/* Pagination */}
      {maxPage > 1 && (
        <Pagination className="py-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(safePage - 1)}
                aria-disabled={safePage <= 1}
                className={
                  safePage <= 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>

            {paginationItems.map((item, index) =>
              item.type === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item.page}>
                  <PaginationLink
                    onClick={() => onPageChange(item.page!)}
                    isActive={item.page === safePage}
                    className="cursor-pointer"
                  >
                    {item.page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(safePage + 1)}
                aria-disabled={safePage >= maxPage}
                className={
                  safePage >= maxPage
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
