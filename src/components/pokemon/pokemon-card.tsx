import { Link } from '@tanstack/react-router'
import { CheckIcon, HeartIcon, PlusIcon } from '@phosphor-icons/react'
import { PokemonTypes } from './pokemon-types'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  formatPokemonId,
  formatPokemonName,
  getSpriteById,
} from '@/lib/pokemon-utils'

// Accepts either string array or nested object array
type TypesInput =
  | Array<string>
  | Array<{ slot: number; type: { name: string } }>

interface PokemonCardProps {
  id: number
  name: string
  types: TypesInput
  isFavorite: boolean
  isInCompare: boolean
  onFavoriteToggle: () => void
  onCompareToggle: () => void
  canAddToCompare: boolean
}

export function PokemonCard({
  id,
  name,
  types,
  isFavorite,
  isInCompare,
  onFavoriteToggle,
  onCompareToggle,
  canAddToCompare,
}: PokemonCardProps) {
  return (
    <Card className="group/pokemon-card relative transition-all hover:shadow-lg">
      {/* Action buttons */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover/pokemon-card:opacity-100">
        <Tooltip>
          <TooltipTrigger
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onFavoriteToggle()
            }}
            className={cn(
              'bg-background/80 hover:bg-muted inline-flex size-6 items-center justify-center rounded-md backdrop-blur-sm',
              isFavorite && 'text-red-500',
            )}
          >
            <HeartIcon weight={isFavorite ? 'fill' : 'regular'} />
          </TooltipTrigger>
          <TooltipContent>
            {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onCompareToggle()
            }}
            disabled={!isInCompare && !canAddToCompare}
            className={cn(
              'bg-background/80 hover:bg-muted inline-flex size-6 items-center justify-center rounded-md backdrop-blur-sm disabled:opacity-50',
              isInCompare && 'text-primary',
            )}
          >
            {isInCompare ? <CheckIcon weight="bold" /> : <PlusIcon />}
          </TooltipTrigger>
          <TooltipContent>
            {isInCompare
              ? 'Remove from compare'
              : canAddToCompare
                ? 'Add to compare'
                : 'Compare list is full'}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Always show favorite indicator if favorited */}
      {isFavorite && (
        <div className="absolute top-2 left-2 z-10">
          <HeartIcon className="text-red-500" weight="fill" />
        </div>
      )}

      <Link
        to="/pokemon/$pokemonId"
        params={{ pokemonId: String(id) }}
        preload="intent"
        viewTransition
        className="focus-visible:ring-ring flex flex-col rounded-xl focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
      >
        <CardContent className="flex flex-col items-center gap-2 pt-4">
          {/* Pokemon image */}
          <div
            className={cn(
              'bg-muted/50 flex size-24 items-center justify-center rounded-full',
              `[view-transition-name:pokemon-image-${id}]`,
            )}
          >
            <img
              src={getSpriteById(id)}
              alt={name}
              className="size-20 object-contain transition-transform group-hover/pokemon-card:scale-110"
              loading="lazy"
            />
          </div>

          {/* Pokemon info */}
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-muted-foreground text-xs">
              {formatPokemonId(id)}
            </span>
            <span
              className={cn(
                'font-medium',
                `[view-transition-name:pokemon-name-${id}]`,
              )}
            >
              {formatPokemonName(name)}
            </span>
            <div className={`[view-transition-name:pokemon-types-${id}]`}>
              <PokemonTypes types={types} size="sm" />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

// Skeleton for loading states
export function PokemonCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 pt-4">
        <div className="bg-muted size-24 animate-pulse rounded-full" />
        <div className="flex flex-col items-center gap-1">
          <div className="bg-muted h-3 w-12 animate-pulse rounded" />
          <div className="bg-muted h-4 w-20 animate-pulse rounded" />
          <div className="flex gap-1">
            <div className="bg-muted h-5 w-14 animate-pulse rounded-full" />
            <div className="bg-muted h-5 w-14 animate-pulse rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
