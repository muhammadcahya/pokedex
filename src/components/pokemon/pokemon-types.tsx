import { Link } from '@tanstack/react-router'
import type { PokemonTypeName } from '@/types/pokemon'
import { cn } from '@/lib/utils'
import { getTypeColor } from '@/lib/type-colors'

interface PokemonTypeBadgeProps {
  type: string
  clickable?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PokemonTypeBadge({
  type,
  clickable = false,
  size = 'md',
  className,
}: PokemonTypeBadgeProps) {
  const colors = getTypeColor(type)

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  }

  const badge = (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium capitalize transition-all',
        sizeClasses[size],
        clickable && 'cursor-pointer hover:scale-105 hover:shadow-md',
        className,
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {type}
    </span>
  )

  if (clickable) {
    return (
      <Link
        to="/"
        search={{ types: type }}
        className="focus-visible:ring-ring inline-flex rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {badge}
      </Link>
    )
  }

  return badge
}

interface PokemonTypesProps {
  types: Array<{ slot: number; type: { name: string } }>
  clickable?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PokemonTypes({
  types,
  clickable = false,
  size = 'md',
  className,
}: PokemonTypesProps) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {types
        .sort((a, b) => a.slot - b.slot)
        .map(({ type }) => (
          <PokemonTypeBadge
            key={type.name}
            type={type.name as PokemonTypeName}
            clickable={clickable}
            size={size}
          />
        ))}
    </div>
  )
}
