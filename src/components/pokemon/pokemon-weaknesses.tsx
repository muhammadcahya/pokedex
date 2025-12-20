import { useQueries } from '@tanstack/react-query'
import { PokemonTypeBadge } from './pokemon-types'
import type { PokemonType } from '@/types/pokemon'
import { typeDetailsOptions } from '@/api/query-options'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { calculateWeaknesses } from '@/lib/pokemon-utils'

interface PokemonWeaknessesProps {
  types: Array<PokemonType>
  clickable?: boolean
  className?: string
}

export function PokemonWeaknesses({
  types,
  clickable = false,
  className,
}: PokemonWeaknessesProps) {
  // Fetch type details for each type to get damage relations
  const typeQueries = useQueries({
    queries: types.map((t) => typeDetailsOptions(t.type.name)),
  })

  const isLoading = typeQueries.some((q) => q.isLoading)
  const damageRelations = typeQueries
    .filter((q) => q.data)
    .map((q) => q.data!.damage_relations)

  if (isLoading) {
    return (
      <div className={cn('flex flex-wrap gap-1.5', className)}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>
    )
  }

  const weaknesses = calculateWeaknesses(damageRelations)

  if (weaknesses.length === 0) {
    return (
      <p className={cn('text-muted-foreground text-sm', className)}>
        No weaknesses
      </p>
    )
  }

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {weaknesses.map((type) => (
        <PokemonTypeBadge
          key={type}
          type={type}
          clickable={clickable}
          size="md"
        />
      ))}
    </div>
  )
}
