import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { evolutionChainOptions } from '@/api/query-options'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  extractIdFromUrl,
  flattenEvolutionChain,
  formatPokemonId,
  formatPokemonName,
  getSpriteById,
} from '@/lib/pokemon-utils'

interface PokemonEvolutionProps {
  evolutionChainUrl: string
  currentPokemonId: number
  className?: string
}

export function PokemonEvolution({
  evolutionChainUrl,
  currentPokemonId,
  className,
}: PokemonEvolutionProps) {
  const chainId = extractIdFromUrl(evolutionChainUrl)

  const { data: evolutionChain, isLoading } = useQuery(
    evolutionChainOptions(chainId),
  )

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-4 overflow-x-auto', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="size-20 rounded-full" />
            {i < 3 && <Skeleton className="size-4" />}
          </div>
        ))}
      </div>
    )
  }

  if (!evolutionChain) {
    return null
  }

  const evolutions = flattenEvolutionChain(evolutionChain)

  if (evolutions.length <= 1) {
    return (
      <p className={cn('text-muted-foreground text-sm', className)}>
        This Pokemon does not evolve.
      </p>
    )
  }

  return (
    <div
      className={cn('flex items-center gap-2 overflow-x-auto p-2', className)}
    >
      {evolutions.map((evolution, index) => (
        <div key={evolution.id} className="flex items-center gap-2">
          <Link
            to="/pokemon/$pokemonId"
            params={{ pokemonId: String(evolution.id) }}
            className={cn(
              'group flex flex-col items-center gap-1 rounded-xl p-2 transition-all',
              evolution.id === currentPokemonId
                ? 'bg-primary/10 ring-primary ring-2'
                : 'hover:bg-muted',
            )}
          >
            <div className="bg-muted/50 flex size-16 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <img
                src={getSpriteById(evolution.id)}
                alt={evolution.name}
                className="size-14"
              />
            </div>
            <span className="text-muted-foreground text-xs">
              {formatPokemonId(evolution.id)}
            </span>
            <span className="text-sm font-medium">
              {formatPokemonName(evolution.name)}
            </span>
            {evolution.minLevel && (
              <span className="text-muted-foreground text-xs">
                Lv. {evolution.minLevel}
              </span>
            )}
            {evolution.item && (
              <span className="text-muted-foreground text-xs capitalize">
                {evolution.item.replace('-', ' ')}
              </span>
            )}
          </Link>

          {index < evolutions.length - 1 && (
            <ArrowRightIcon className="text-muted-foreground size-5 shrink-0" />
          )}
        </div>
      ))}
    </div>
  )
}
