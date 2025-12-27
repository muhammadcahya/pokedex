import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  SpinnerIcon,
  XIcon,
} from '@phosphor-icons/react'

import type { PokemonTypeName } from '@/types/pokemon'
import type { ParsedFilterState } from '@/lib/schemas/search'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'
import { ALL_TYPES, getTypeColor } from '@/lib/type-colors'
import { GENERATIONS } from '@/lib/generation-data'
import { HEIGHT_OPTIONS, SORT_OPTIONS, WEIGHT_OPTIONS } from '@/types/filters'
import {
  PokemonSearchSchema,
  countActiveFilters,
  hasActiveFilters,
  parseSearchParams,
  serializeSearchParams,
} from '@/lib/schemas/search'
import { echoSearchParamsOptions } from '@/api/query-options'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/search')({
  validateSearch: zodValidator(PokemonSearchSchema),
  component: Search,
})

function Search() {
  const searchParams = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  // Parse URL params into usable state
  const filters = parseSearchParams(searchParams)
  const activeCount = countActiveFilters(filters)
  const hasFilters = hasActiveFilters(filters)

  // Query the server with current filters (demonstrates loading states)
  const {
    data: apiResponse,
    isPending,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = useQuery(echoSearchParamsOptions(filters, 800))

  // Update a single filter field
  const updateFilter = <TKey extends keyof ParsedFilterState>(
    key: TKey,
    value: ParsedFilterState[TKey],
  ) => {
    const newState = { ...filters, [key]: value }
    navigate({
      search: () => serializeSearchParams(newState),
    })
  }

  // Toggle a type in the types array
  const toggleType = (type: PokemonTypeName) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type]
    updateFilter('types', newTypes)
  }

  // Toggle a region in the regions array
  const toggleRegion = (region: string) => {
    const newRegions = filters.regions.includes(region)
      ? filters.regions.filter((r) => r !== region)
      : [...filters.regions, region]
    updateFilter('regions', newRegions)
  }

  // Reset all filters
  const resetFilters = () => {
    navigate({ search: () => ({}) })
  }

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Pokemon Search</h2>
          <p className="text-muted-foreground">
            Filter and search Pokemon with URL-synced state. All filters are
            reflected in the URL and can be shared or bookmarked.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
          {/* Filters Sidebar */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  {activeCount > 0 && (
                    <Badge variant="secondary">{activeCount} active</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  {/* Search Input */}
                  <Field>
                    <FieldLabel htmlFor="search-input">
                      Search Pokemon
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <MagnifyingGlassIcon className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="search-input"
                        placeholder="Search by name..."
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                      />
                      {filters.search && (
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            onClick={() => updateFilter('search', '')}
                            size="icon-xs"
                          >
                            <XIcon className="size-3" />
                          </InputGroupButton>
                        </InputGroupAddon>
                      )}
                    </InputGroup>
                    <FieldDescription>Filter Pokemon by name</FieldDescription>
                  </Field>

                  {/* Region Filter */}
                  <Field>
                    <FieldLabel>Region</FieldLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {GENERATIONS.map((gen) => {
                        const isSelected = filters.regions.includes(gen.region)
                        return (
                          <button
                            key={gen.region}
                            type="button"
                            onClick={() => toggleRegion(gen.region)}
                            className={cn(
                              'rounded-full px-3 py-1 text-xs font-medium transition-all',
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80',
                            )}
                          >
                            {gen.region}
                          </button>
                        )
                      })}
                    </div>
                    <FieldDescription>
                      Select one or more regions
                    </FieldDescription>
                  </Field>

                  {/* Type Filter */}
                  <Field>
                    <FieldLabel>Type</FieldLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {ALL_TYPES.map((type) => {
                        const colors = getTypeColor(type)
                        const isSelected = filters.types.includes(type)
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleType(type)}
                            className={cn(
                              'rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-all',
                              isSelected
                                ? 'ring-2 ring-offset-2'
                                : 'opacity-60 hover:opacity-100',
                            )}
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                              ...(isSelected &&
                                ({
                                  '--tw-ring-color': colors.border,
                                } as React.CSSProperties)),
                            }}
                          >
                            {type}
                          </button>
                        )
                      })}
                    </div>
                    <FieldDescription>
                      Select one or more Pokemon types
                    </FieldDescription>
                  </Field>

                  {/* Height Filter */}
                  <Field>
                    <FieldLabel htmlFor="height-select">Height</FieldLabel>
                    <Select
                      value={filters.height}
                      onValueChange={(value) =>
                        updateFilter(
                          'height',
                          value as ParsedFilterState['height'],
                        )
                      }
                    >
                      <SelectTrigger id="height-select">
                        <SelectValue>
                          {HEIGHT_OPTIONS.find(
                            (o) => o.value === filters.height,
                          )?.label ?? 'All Heights'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {HEIGHT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Weight Filter */}
                  <Field>
                    <FieldLabel htmlFor="weight-select">Weight</FieldLabel>
                    <Select
                      value={filters.weight}
                      onValueChange={(value) =>
                        updateFilter(
                          'weight',
                          value as ParsedFilterState['weight'],
                        )
                      }
                    >
                      <SelectTrigger id="weight-select">
                        <SelectValue>
                          {WEIGHT_OPTIONS.find(
                            (o) => o.value === filters.weight,
                          )?.label ?? 'All Weights'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {WEIGHT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Sort */}
                  <Field>
                    <FieldLabel htmlFor="sort-select">Sort By</FieldLabel>
                    <Select
                      value={filters.sort}
                      onValueChange={(value) =>
                        updateFilter('sort', value as ParsedFilterState['sort'])
                      }
                    >
                      <SelectTrigger id="sort-select">
                        <SelectValue>
                          {SORT_OPTIONS.find((o) => o.value === filters.sort)
                            ?.label ?? 'Lowest Number'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Boolean: Legendary Only */}
                  <Field orientation="horizontal">
                    <Switch
                      id="legendary-switch"
                      checked={filters.legendaryOnly}
                      onCheckedChange={(checked) =>
                        updateFilter('legendaryOnly', checked)
                      }
                    />
                    <FieldLabel
                      htmlFor="legendary-switch"
                      className="cursor-pointer font-normal"
                    >
                      Legendary Only
                    </FieldLabel>
                  </Field>

                  {/* Boolean: Has Evolution */}
                  <Field orientation="horizontal">
                    <Switch
                      id="evolution-switch"
                      checked={filters.hasEvolution}
                      onCheckedChange={(checked) =>
                        updateFilter('hasEvolution', checked)
                      }
                    />
                    <FieldLabel
                      htmlFor="evolution-switch"
                      className="cursor-pointer font-normal"
                    >
                      Can Evolve
                    </FieldLabel>
                  </Field>

                  {/* Number: Minimum Base Stats */}
                  <Field>
                    <FieldLabel htmlFor="min-stats">
                      Min Base Stats Total
                    </FieldLabel>
                    <div className="flex items-center gap-3">
                      <Slider
                        id="min-stats"
                        value={[filters.minStats ?? 0]}
                        onValueChange={(values) => {
                          const value = Array.isArray(values)
                            ? values[0]
                            : values
                          updateFilter('minStats', value || null)
                        }}
                        max={720}
                        step={10}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={filters.minStats ?? ''}
                        onChange={(e) => {
                          const val = e.target.value
                            ? Math.min(720, Math.max(0, Number(e.target.value)))
                            : null
                          updateFilter('minStats', val)
                        }}
                        className="w-20 text-center"
                        min={0}
                        max={720}
                        placeholder="0"
                      />
                    </div>
                    <FieldDescription>
                      Filter by minimum base stat total (0-720)
                    </FieldDescription>
                  </Field>

                  {/* Range: Base Stats Range */}
                  <Field>
                    <FieldLabel>Base Stats Range</FieldLabel>
                    <div className="space-y-3">
                      <Slider
                        value={filters.statRange}
                        onValueChange={(values) => {
                          if (Array.isArray(values) && values.length === 2) {
                            updateFilter('statRange', [values[0], values[1]])
                          }
                        }}
                        min={0}
                        max={720}
                        step={10}
                      />
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs">
                            Min:
                          </span>
                          <Input
                            type="number"
                            value={filters.statRange[0]}
                            onChange={(e) => {
                              const min = Math.max(
                                0,
                                Math.min(
                                  Number(e.target.value),
                                  filters.statRange[1],
                                ),
                              )
                              updateFilter('statRange', [
                                min,
                                filters.statRange[1],
                              ])
                            }}
                            className="h-7 w-16 text-center text-xs"
                            min={0}
                            max={filters.statRange[1]}
                          />
                        </div>
                        <div className="bg-muted h-px flex-1" />
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs">
                            Max:
                          </span>
                          <Input
                            type="number"
                            value={filters.statRange[1]}
                            onChange={(e) => {
                              const max = Math.min(
                                720,
                                Math.max(
                                  Number(e.target.value),
                                  filters.statRange[0],
                                ),
                              )
                              updateFilter('statRange', [
                                filters.statRange[0],
                                max,
                              ])
                            }}
                            className="h-7 w-16 text-center text-xs"
                            min={filters.statRange[0]}
                            max={720}
                          />
                        </div>
                      </div>
                    </div>
                    <FieldDescription>
                      Filter by base stat range (dual-handle slider)
                    </FieldDescription>
                  </Field>

                  {/* Reset Button */}
                  {hasFilters && (
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="w-full"
                    >
                      <XIcon className="mr-2 size-4" />
                      Reset All Filters
                    </Button>
                  )}
                </FieldGroup>
              </CardContent>
            </Card>
          </div>

          {/* Results Area */}
          <div className="flex flex-col gap-6">
            {/* Active Filters Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Active Filters</CardTitle>
                <CardDescription>
                  Click any filter badge to remove it. These filters are synced
                  with the URL.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasFilters ? (
                  <div className="flex flex-wrap gap-2">
                    {/* Search term */}
                    {filters.search && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer gap-1 pr-1"
                        onClick={() => updateFilter('search', '')}
                      >
                        Search: &quot;{filters.search}&quot;
                        <XIcon className="size-3" />
                      </Badge>
                    )}

                    {/* Regions */}
                    {filters.regions.map((region) => (
                      <Badge
                        key={region}
                        variant="outline"
                        className="cursor-pointer gap-1 pr-1"
                        onClick={() => toggleRegion(region)}
                      >
                        {region}
                        <XIcon className="size-3" />
                      </Badge>
                    ))}

                    {/* Types */}
                    {filters.types.map((type) => {
                      const colors = getTypeColor(type)
                      return (
                        <Badge
                          key={type}
                          className="cursor-pointer gap-1 pr-1 capitalize"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                          }}
                          onClick={() => toggleType(type)}
                        >
                          {type}
                          <XIcon className="size-3" />
                        </Badge>
                      )
                    })}

                    {/* Height */}
                    {filters.height !== 'all' && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer gap-1 pr-1"
                        onClick={() => updateFilter('height', 'all')}
                      >
                        Height:{' '}
                        {
                          HEIGHT_OPTIONS.find((o) => o.value === filters.height)
                            ?.label
                        }
                        <XIcon className="size-3" />
                      </Badge>
                    )}

                    {/* Weight */}
                    {filters.weight !== 'all' && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer gap-1 pr-1"
                        onClick={() => updateFilter('weight', 'all')}
                      >
                        Weight:{' '}
                        {
                          WEIGHT_OPTIONS.find((o) => o.value === filters.weight)
                            ?.label
                        }
                        <XIcon className="size-3" />
                      </Badge>
                    )}

                    {/* Sort (non-default) */}
                    {filters.sort !== 'number-asc' && (
                      <Badge
                        variant="ghost"
                        className="cursor-pointer gap-1 pr-1"
                        onClick={() => updateFilter('sort', 'number-asc')}
                      >
                        Sort:{' '}
                        {
                          SORT_OPTIONS.find((o) => o.value === filters.sort)
                            ?.label
                        }
                        <XIcon className="size-3" />
                      </Badge>
                    )}

                    {/* Boolean: Legendary Only */}
                    {filters.legendaryOnly && (
                      <Badge
                        variant="default"
                        className="cursor-pointer gap-1 pr-1"
                        onClick={() => updateFilter('legendaryOnly', false)}
                      >
                        Legendary Only
                        <XIcon className="size-3" />
                      </Badge>
                    )}

                    {/* Boolean: Has Evolution */}
                    {filters.hasEvolution && (
                      <Badge
                        variant="default"
                        className="cursor-pointer gap-1 pr-1"
                        onClick={() => updateFilter('hasEvolution', false)}
                      >
                        Can Evolve
                        <XIcon className="size-3" />
                      </Badge>
                    )}

                    {/* Number: Min Stats */}
                    {filters.minStats !== null && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer gap-1 pr-1"
                        onClick={() => updateFilter('minStats', null)}
                      >
                        Min Stats: {filters.minStats}
                        <XIcon className="size-3" />
                      </Badge>
                    )}

                    {/* Range: Stat Range */}
                    {(filters.statRange[0] !== 0 ||
                      filters.statRange[1] !== 720) && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer gap-1 pr-1"
                        onClick={() => updateFilter('statRange', [0, 720])}
                      >
                        Range: {filters.statRange[0]}-{filters.statRange[1]}
                        <XIcon className="size-3" />
                      </Badge>
                    )}
                  </div>
                ) : (
                  <Empty className="py-8">
                    <EmptyTitle>No filters applied</EmptyTitle>
                    <EmptyDescription>
                      Use the filter panel to narrow down Pokemon results
                    </EmptyDescription>
                  </Empty>
                )}
              </CardContent>
            </Card>

            {/* Server API Response */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Server Response
                      {isFetching && (
                        <SpinnerIcon className="text-muted-foreground size-4 animate-spin" />
                      )}
                      {!isFetching && apiResponse && (
                        <CheckCircleIcon className="size-4 text-green-500" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      Filters sent to server via TanStack Query. Shows loading
                      states and server round-trip.
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isFetching}
                  >
                    <ArrowsClockwiseIcon
                      className={cn(
                        'mr-2 size-4',
                        isFetching && 'animate-spin',
                      )}
                    />
                    Refetch
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPending ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : apiResponse ? (
                  <>
                    {/* Response Summary */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs font-medium">
                          Processing Time
                        </p>
                        <p className="text-lg font-semibold">
                          {apiResponse.processingTime}ms
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-muted-foreground text-xs font-medium">
                          Filters Active
                        </p>
                        <p className="text-lg font-semibold">
                          {apiResponse.summary.totalFiltersActive}
                        </p>
                      </div>
                    </div>

                    {/* Summary badges */}
                    <div className="flex flex-wrap gap-2">
                      {apiResponse.summary.searchTerm && (
                        <Badge variant="outline">
                          Search: {apiResponse.summary.searchTerm}
                        </Badge>
                      )}
                      {apiResponse.summary.selectedTypes.length > 0 && (
                        <Badge variant="outline">
                          {apiResponse.summary.selectedTypes.length} types
                        </Badge>
                      )}
                      {apiResponse.summary.selectedRegions.length > 0 && (
                        <Badge variant="outline">
                          {apiResponse.summary.selectedRegions.length} regions
                        </Badge>
                      )}
                      {apiResponse.summary.hasBooleanFilters && (
                        <Badge variant="default">Boolean filters</Badge>
                      )}
                      {apiResponse.summary.hasRangeFilter && (
                        <Badge variant="default">Range filter</Badge>
                      )}
                    </div>

                    {/* Server Info */}
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <span>
                        Received:{' '}
                        {new Date(apiResponse.receivedAt).toLocaleTimeString()}
                      </span>
                      <span>Node {apiResponse.serverInfo.nodeVersion}</span>
                    </div>

                    {/* Raw Response */}
                    <details className="group">
                      <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-xs">
                        View raw response
                      </summary>
                      <pre className="bg-muted mt-2 max-h-48 overflow-auto rounded-lg p-3 font-mono text-xs">
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                    </details>

                    {/* Last updated */}
                    {dataUpdatedAt && (
                      <p className="text-muted-foreground text-xs">
                        Last updated:{' '}
                        {new Date(dataUpdatedAt).toLocaleTimeString()}
                      </p>
                    )}
                  </>
                ) : null}
              </CardContent>
            </Card>

            {/* URL State Preview */}
            <Card>
              <CardHeader>
                <CardTitle>URL State</CardTitle>
                <CardDescription>
                  TanStack Router syncs all filter state with the URL. This
                  makes your filters shareable, bookmarkable, and
                  browser-navigable.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm font-medium">
                    Current URL Search Params:
                  </p>
                  <code className="bg-muted block rounded-lg p-3 font-mono text-sm break-all">
                    {typeof window !== 'undefined' && window.location.search
                      ? window.location.search
                      : '(no params)'}
                  </code>
                </div>

                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm font-medium">
                    Parsed State Object:
                  </p>
                  <pre className="bg-muted max-h-48 overflow-auto rounded-lg p-3 font-mono text-xs">
                    {JSON.stringify(filters, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Feature Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>TanStack Router Features</CardTitle>
                <CardDescription>
                  This page demonstrates key search params as state patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary mt-0.5 rounded px-1.5 py-0.5 text-xs font-medium">
                      1
                    </span>
                    <span>
                      <strong className="text-foreground">
                        Schema Validation
                      </strong>{' '}
                      &ndash; Zod schema validates all URL params on navigation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary mt-0.5 rounded px-1.5 py-0.5 text-xs font-medium">
                      2
                    </span>
                    <span>
                      <strong className="text-foreground">Type Safety</strong>{' '}
                      &ndash; Full TypeScript inference from schema to component
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary mt-0.5 rounded px-1.5 py-0.5 text-xs font-medium">
                      3
                    </span>
                    <span>
                      <strong className="text-foreground">
                        Atomic Updates
                      </strong>{' '}
                      &ndash; Update individual filters without losing others
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary mt-0.5 rounded px-1.5 py-0.5 text-xs font-medium">
                      4
                    </span>
                    <span>
                      <strong className="text-foreground">URL as State</strong>{' '}
                      &ndash; Shareable, bookmarkable, browser history works
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
