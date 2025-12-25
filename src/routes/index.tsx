import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { FilterState, SearchParams } from '@/types/filters'
import type { PokemonTypeName } from '@/types/pokemon'
import { Header } from '@/components/layout/header'
import { SearchBar } from '@/components/layout/search-bar'
import { PokemonGrid } from '@/components/pokemon/pokemon-grid'
import { FilterPanel } from '@/components/filters/filter-panel'

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    search: typeof search.search === 'string' ? search.search : undefined,
    regions: typeof search.regions === 'string' ? search.regions : undefined,
    types: typeof search.types === 'string' ? search.types : undefined,
    ability: typeof search.ability === 'string' ? search.ability : undefined,
    height:
      typeof search.height === 'string'
        ? (search.height as FilterState['height'])
        : undefined,
    weight:
      typeof search.weight === 'string'
        ? (search.weight as FilterState['weight'])
        : undefined,
    sort:
      typeof search.sort === 'string'
        ? (search.sort as FilterState['sort'])
        : undefined,
  }),
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

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.search || '',
    regions: searchParams.regions ? searchParams.regions.split(',') : [],
    types: searchParams.types
      ? (searchParams.types.split(',') as Array<PokemonTypeName>)
      : [],
    ability: searchParams.ability || '',
    height: searchParams.height || 'all',
    weight: searchParams.weight || 'all',
    sort: searchParams.sort || 'number-asc',
  }))

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }))
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
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Pokemon grid */}
        <PokemonGrid filters={filters} />
      </main>
    </div>
  )
}
