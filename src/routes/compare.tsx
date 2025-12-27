import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  CaretLeftIcon,
  ScalesIcon,
  TrashIcon,
  XIcon,
} from '@phosphor-icons/react'
import { pokemonBatchOptions } from '@/api/query-options'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { PokemonTypes } from '@/components/pokemon/pokemon-types'
import { PokemonStats } from '@/components/pokemon/pokemon-stats'
import { PokemonAbilities } from '@/components/pokemon/pokemon-abilities'
import { PokemonWeaknesses } from '@/components/pokemon/pokemon-weaknesses'
import { useCompare } from '@/hooks/use-compare'
import {
  formatHeight,
  formatPokemonId,
  formatPokemonName,
  formatWeight,
  getArtworkById,
} from '@/lib/pokemon-utils'
import { MAX_COMPARE_POKEMON } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/compare')({
  head: () => ({
    meta: [
      { title: 'Compare Pokemon - Pokedex' },
      {
        name: 'description',
        content:
          'Compare up to 4 Pokemon side by side to see their stats, types, and abilities.',
      },
    ],
  }),
  component: ComparePage,
})

function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()

  const { data: pokemonList, isLoading } = useQuery({
    ...pokemonBatchOptions(compareList),
    enabled: compareList.length > 0,
  })

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              render={<Link to="/" />}
              nativeButton={false}
            >
              <CaretLeftIcon />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <ScalesIcon className="size-6" />
              <h1 className="text-2xl font-bold">Compare Pokemon</h1>
            </div>
          </div>

          {compareList.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompare}
              className="text-destructive gap-1.5"
            >
              <TrashIcon />
              Clear All
            </Button>
          )}
        </div>

        <p className="text-muted-foreground mb-6 text-sm">
          {compareList.length} of {MAX_COMPARE_POKEMON} Pokemon selected
        </p>

        {/* Content */}
        {compareList.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ScalesIcon />
              </EmptyMedia>
              <EmptyTitle>No Pokemon to compare</EmptyTitle>
              <EmptyDescription>
                Add Pokemon to your compare list by clicking the + icon on any
                Pokemon card.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {compareList.map((id) => (
              <CompareCardSkeleton key={id} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pokemonList?.map((pokemon) => (
              <CompareCard
                key={pokemon.id}
                pokemon={pokemon}
                onRemove={() => removeFromCompare(pokemon.id, pokemon.name)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

interface CompareCardProps {
  pokemon: {
    id: number
    name: string
    types: Array<{ slot: number; type: { name: string; url: string } }>
    stats: Array<{
      base_stat: number
      effort: number
      stat: { name: string; url: string }
    }>
    abilities: Array<{
      ability: { name: string; url: string }
      is_hidden: boolean
      slot: number
    }>
    height: number
    weight: number
  }
  onRemove: () => void
}

function CompareCard({ pokemon, onRemove }: CompareCardProps) {
  return (
    <Card className="relative">
      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onRemove}
        className="absolute top-2 right-2 z-10"
      >
        <XIcon />
      </Button>

      <CardContent className="pt-4">
        {/* Image and basic info */}
        <div className="mb-4 flex flex-col items-center">
          <Link
            to="/pokemon/$pokemonId"
            params={{ pokemonId: String(pokemon.id) }}
            viewTransition
            className="group"
          >
            <div
              className={cn(
                'bg-muted/30 mb-2 flex size-32 items-center justify-center rounded-2xl',
                `[view-transition-name:pokemon-image-${pokemon.id}]`,
              )}
            >
              <img
                src={getArtworkById(pokemon.id)}
                alt={pokemon.name}
                className="h-full w-full object-contain p-2 transition-transform group-hover:scale-110"
              />
            </div>
          </Link>
          <p className="text-muted-foreground text-xs">
            {formatPokemonId(pokemon.id)}
          </p>
          <Link
            to="/pokemon/$pokemonId"
            params={{ pokemonId: String(pokemon.id) }}
            viewTransition
            className={cn(
              'font-medium hover:underline',
              `[view-transition-name:pokemon-name-${pokemon.id}]`,
            )}
          >
            {formatPokemonName(pokemon.name)}
          </Link>
        </div>

        {/* Types */}
        <div className="mb-4">
          <h3 className="text-muted-foreground mb-1 text-xs font-medium">
            Type
          </h3>
          <div className={`[view-transition-name:pokemon-types-${pokemon.id}]`}>
            <PokemonTypes types={pokemon.types} size="sm" />
          </div>
        </div>

        {/* Physical stats */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">Height</span>
            <p className="font-medium">{formatHeight(pokemon.height)}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Weight</span>
            <p className="font-medium">{formatWeight(pokemon.weight)}</p>
          </div>
        </div>

        {/* Abilities */}
        <div className="mb-4">
          <h3 className="text-muted-foreground mb-1 text-xs font-medium">
            Abilities
          </h3>
          <PokemonAbilities abilities={pokemon.abilities} />
        </div>

        {/* Weaknesses */}
        <div className="mb-4">
          <h3 className="text-muted-foreground mb-1 text-xs font-medium">
            Weaknesses
          </h3>
          <PokemonWeaknesses types={pokemon.types} />
        </div>

        {/* Stats */}
        <div>
          <h3 className="text-muted-foreground mb-2 text-xs font-medium">
            Base Stats
          </h3>
          <PokemonStats stats={pokemon.stats} />
        </div>
      </CardContent>
    </Card>
  )
}

function CompareCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="mb-4 flex flex-col items-center">
          <Skeleton className="mb-2 size-32 rounded-2xl" />
          <Skeleton className="mb-1 h-3 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="mb-4 h-6 w-full" />
        <Skeleton className="mb-4 h-20 w-full" />
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  )
}
