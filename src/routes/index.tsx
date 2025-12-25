import { useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import type { FilterState } from '@/types/filters'
import {
  DEFAULT_PAGE_SIZE,
  PokemonFiltersSchema,
  parseFiltersFromUrl,
  serializeFiltersToUrl,
} from '@/types/filters'
import { Header } from '@/components/layout/header'
import { SearchBar } from '@/components/layout/search-bar'
import { PokemonGrid } from '@/components/pokemon/pokemon-grid'
import { FilterPanel } from '@/components/filters/filter-panel'

export const Route = createFileRoute('/')({
  validateSearch: zodValidator(PokemonFiltersSchema),
  head: () => ({
    meta: [
      { title: 'Pokedex - Explore All Pokemon' },
      {
        name: 'description',
        content:
          'Explore and discover all 1025 Pokemon from every generation. Search, filter, compare, and find your favorites.',
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  // Derive filter state from URL
  const filters = useMemo(
    () => parseFiltersFromUrl(searchParams),
    [searchParams],
  )

  // Get page and limit from URL (with defaults)
  const page = searchParams.page || 1
  const limit = searchParams.limit || DEFAULT_PAGE_SIZE

  // Update URL when filters change
  const updateFilters = (newFilters: FilterState) => {
    navigate({
      search: serializeFiltersToUrl(newFilters, 1, limit), // Reset to page 1
      replace: true,
    })
  }

  // Update search specifically (with debounce handling in SearchBar)
  const handleSearchChange = (search: string) => {
    updateFilters({ ...filters, search })
  }

  // Reset all filters
  const resetFilters = () => {
    navigate({ search: {}, replace: true })
  }

  // Update page
  const handlePageChange = (newPage: number) => {
    navigate({
      search: serializeFiltersToUrl(filters, newPage, limit),
      replace: true,
    })
  }

  // Update limit
  const handleLimitChange = (newLimit: number) => {
    navigate({
      search: serializeFiltersToUrl(filters, 1, newLimit), // Reset to page 1
      replace: true,
    })
  }

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Hero section */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <img src="/pokemon-logo.svg" alt="Pokemon" className="h-16 w-auto" />
          <p className="text-muted-foreground max-w-md">
            Explore and discover all Pokemon from every generation. Search,
            filter, and find your favorites.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <SearchBar
              value={filters.search}
              onChange={handleSearchChange}
              className="flex-1"
            />
          </div>
          <FilterPanel
            filters={filters}
            onFiltersChange={updateFilters}
            onReset={resetFilters}
          />
        </div>

        {/* Pokemon grid with pagination */}
        <PokemonGrid
          filters={filters}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </main>
    </div>
  )
}
