import { Link } from '@tanstack/react-router'
import type { PokemonAbility } from '@/types/pokemon'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatPokemonName } from '@/lib/pokemon-utils'

interface PokemonAbilitiesProps {
  abilities: Array<PokemonAbility>
  clickable?: boolean
  className?: string
}

export function PokemonAbilities({
  abilities,
  clickable = false,
  className,
}: PokemonAbilitiesProps) {
  const sortedAbilities = [...abilities].sort((a, b) => a.slot - b.slot)

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {sortedAbilities.map(({ ability, is_hidden }) =>
        clickable ? (
          <Link
            key={ability.name}
            to="/"
            search={{ ability: ability.name }}
            className={cn(
              'bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors',
            )}
          >
            <div className="flex items-center gap-1.5">
              <span>{formatPokemonName(ability.name)}</span>
              {is_hidden && (
                <Badge variant="outline" className="h-4 px-1 text-[10px]">
                  Hidden
                </Badge>
              )}
            </div>
          </Link>
        ) : (
          <div
            key={ability.name}
            className="bg-secondary text-secondary-foreground inline-flex items-center rounded-lg px-3 py-1.5 text-sm"
          >
            <div className="flex items-center gap-1.5">
              <span>{formatPokemonName(ability.name)}</span>
              {is_hidden && (
                <Badge variant="outline" className="h-4 px-1 text-[10px]">
                  Hidden
                </Badge>
              )}
            </div>
          </div>
        ),
      )}
    </div>
  )
}
