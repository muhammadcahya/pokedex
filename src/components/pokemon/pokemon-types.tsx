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

// Accepts either string array or nested object array for backward compatibility
type TypesInput =
  | Array<string>
  | Array<{ slot: number; type: { name: string } }>

interface PokemonTypesProps {
  types: TypesInput
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
  // Normalize types to string array
  const normalizedTypes: Array<string> =
    types.length > 0 && typeof types[0] === 'string'
      ? (types as Array<string>)
      : (types as Array<{ slot: number; type: { name: string } }>)
          .sort((a, b) => a.slot - b.slot)
          .map((t) => t.type.name)

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {normalizedTypes.map((typeName) => (
        <PokemonTypeBadge
          key={typeName}
          type={typeName as PokemonTypeName}
          clickable={clickable}
          size={size}
        />
      ))}
    </div>
  )
}
