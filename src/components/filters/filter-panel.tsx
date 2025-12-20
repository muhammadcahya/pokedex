import { FunnelIcon, XIcon } from '@phosphor-icons/react'
import type { PokemonTypeName } from '@/types/pokemon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ALL_TYPES, getTypeColor } from '@/lib/type-colors'

interface FilterPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTypes: Array<PokemonTypeName>
  onTypesChange: (types: Array<PokemonTypeName>) => void
}

export function FilterPanel({
  open,
  onOpenChange,
  selectedTypes,
  onTypesChange,
}: FilterPanelProps) {
  const handleTypeToggle = (type: PokemonTypeName) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type))
    } else {
      onTypesChange([...selectedTypes, type])
    }
  }

  const handleClearFilters = () => {
    onTypesChange([])
  }

  const hasFilters = selectedTypes.length > 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenChange(!open)}
          className={cn('gap-1.5', open && 'bg-muted')}
        >
          <FunnelIcon className="size-4" />
          <span>Filters</span>
          {hasFilters && (
            <Badge variant="secondary" className="ml-1 px-1.5">
              {selectedTypes.length}
            </Badge>
          )}
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
      </div>

      {/* Selected types chips */}
      {selectedTypes.length > 0 && !open && (
        <div className="flex flex-wrap gap-1">
          {selectedTypes.map((type) => {
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
        </div>
      )}

      {/* Filter panel */}
      {open && (
        <div className="bg-card ring-border mt-2 rounded-lg p-4 ring-1">
          <div className="space-y-4">
            {/* Type filter */}
            <div>
              <h3 className="mb-2 text-sm font-medium">Type</h3>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TYPES.map((type) => {
                  const colors = getTypeColor(type)
                  const isSelected = selectedTypes.includes(type)
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
              <p className="text-muted-foreground mt-2 text-xs">
                Select multiple types to find Pokemon with all selected types
                (e.g., Grass + Poison for Bulbasaur)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
