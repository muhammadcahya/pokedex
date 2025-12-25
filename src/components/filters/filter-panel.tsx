import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CaretUpDownIcon, FunnelSimpleIcon, XIcon } from '@phosphor-icons/react'
import type { PokemonTypeName } from '@/types/pokemon'
import type { FilterState } from '@/types/filters'
import {
  DEFAULT_FILTERS,
  HEIGHT_OPTIONS,
  SORT_OPTIONS,
  WEIGHT_OPTIONS,
} from '@/types/filters'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { cn } from '@/lib/utils'
import { ALL_TYPES, getTypeColor } from '@/lib/type-colors'
import { GENERATIONS } from '@/lib/generation-data'
import { allAbilitiesOptions } from '@/api/query-options'

interface FilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Fetch abilities for dropdown
  const { data: abilitiesData } = useQuery(allAbilitiesOptions())
  const abilities = abilitiesData?.results ?? []

  const updateFilter = <TKey extends keyof FilterState>(
    key: TKey,
    value: FilterState[TKey],
  ) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleTypeToggle = (type: PokemonTypeName) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type]
    updateFilter('types', newTypes)
  }

  const handleRegionToggle = (region: string) => {
    const newRegions = filters.regions.includes(region)
      ? filters.regions.filter((r) => r !== region)
      : [...filters.regions, region]
    updateFilter('regions', newRegions)
  }

  const handleClearFilters = () => {
    onFiltersChange(DEFAULT_FILTERS)
  }

  const hasFilters =
    filters.types.length > 0 ||
    filters.regions.length > 0 ||
    filters.ability !== '' ||
    filters.height !== 'all' ||
    filters.weight !== 'all'

  const activeFilterCount =
    filters.types.length +
    filters.regions.length +
    (filters.ability ? 1 : 0) +
    (filters.height !== 'all' ? 1 : 0) +
    (filters.weight !== 'all' ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Header row with toggle and sort */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn('gap-1.5', showAdvanced && 'bg-muted')}
        >
          <FunnelSimpleIcon />
          <span>Advanced Search</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5">
              {activeFilterCount}
            </Badge>
          )}
          <CaretUpDownIcon className="ml-1 size-3" />
        </Button>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground gap-1"
          >
            <XIcon className="size-3" />
            Clear
          </Button>
        )}

        {/* Sort dropdown */}
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                'focus-visible:border-ring focus-visible:ring-ring/50 border-border bg-background hover:bg-muted dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inline-flex h-7 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium transition-all outline-none focus-visible:ring-[3px]',
              )}
            >
              Sort By:{' '}
              {SORT_OPTIONS.find((o) => o.value === filters.sort)?.label}
              <CaretUpDownIcon className="size-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => updateFilter('sort', option.value)}
                  className={cn(
                    filters.sort === option.value && 'bg-muted font-medium',
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Advanced filter panel */}
      {showAdvanced && (
        <div className="bg-card ring-border rounded-lg p-4 ring-1">
          <div className="space-y-6">
            {/* Region filter */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Region</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilter('regions', [])}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                    filters.regions.length === 0
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80',
                  )}
                >
                  All Regions
                </button>
                {GENERATIONS.map((gen) => (
                  <button
                    key={gen.region}
                    onClick={() => handleRegionToggle(gen.region)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                      filters.regions.includes(gen.region)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80',
                    )}
                  >
                    {gen.region}
                  </button>
                ))}
              </div>
            </div>

            {/* Type filter */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Type</h3>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TYPES.map((type) => {
                  const colors = getTypeColor(type)
                  const isSelected = filters.types.includes(type)
                  return (
                    <button
                      key={type}
                      onClick={() => handleTypeToggle(type)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium capitalize transition-all',
                        isSelected
                          ? 'ring-2 ring-offset-2'
                          : 'opacity-70 hover:opacity-100',
                      )}
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                        ...(isSelected && { ringColor: colors.border }),
                      }}
                    >
                      {type}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Ability filter */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Ability</h3>
              <Combobox
                value={filters.ability || null}
                onValueChange={(value) => updateFilter('ability', value ?? '')}
              >
                <ComboboxInput
                  placeholder="All Abilities"
                  className="w-full sm:w-80"
                  showClear={!!filters.ability}
                />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxEmpty>No ability found.</ComboboxEmpty>
                    {abilities.map((ability) => (
                      <ComboboxItem key={ability.name} value={ability.name}>
                        <span className="capitalize">
                          {ability.name.replace(/-/g, ' ')}
                        </span>
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            {/* Height and Weight filters */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Height filter */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Height</h3>
                <div className="flex flex-wrap gap-2">
                  {HEIGHT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFilter('height', option.value)}
                      className={cn(
                        'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                        filters.height === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80',
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight filter */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Weight</h3>
                <div className="flex flex-wrap gap-2">
                  {WEIGHT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFilter('weight', option.value)}
                      className={cn(
                        'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                        filters.weight === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80',
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active filter chips (when panel is closed) */}
      {!showAdvanced && hasFilters && (
        <div className="flex flex-wrap gap-1.5">
          {filters.regions.map((region) => (
            <button
              key={region}
              onClick={() => handleRegionToggle(region)}
              className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-all hover:opacity-80"
            >
              {region}
              <XIcon className="size-3" />
            </button>
          ))}
          {filters.types.map((type) => {
            const colors = getTypeColor(type)
            return (
              <button
                key={type}
                onClick={() => handleTypeToggle(type)}
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize transition-all hover:opacity-80"
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                }}
              >
                {type}
                <XIcon className="size-3" />
              </button>
            )
          })}
          {filters.ability && (
            <button
              onClick={() => updateFilter('ability', '')}
              className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize transition-all hover:opacity-80"
            >
              {filters.ability.replace(/-/g, ' ')}
              <XIcon className="size-3" />
            </button>
          )}
          {filters.height !== 'all' && (
            <button
              onClick={() => updateFilter('height', 'all')}
              className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-all hover:opacity-80"
            >
              {HEIGHT_OPTIONS.find((o) => o.value === filters.height)?.label}
              <XIcon className="size-3" />
            </button>
          )}
          {filters.weight !== 'all' && (
            <button
              onClick={() => updateFilter('weight', 'all')}
              className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-all hover:opacity-80"
            >
              {WEIGHT_OPTIONS.find((o) => o.value === filters.weight)?.label}
              <XIcon className="size-3" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
