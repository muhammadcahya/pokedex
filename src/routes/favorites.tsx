import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CaretLeftIcon, HeartIcon, TrashIcon } from '@phosphor-icons/react'
import { pokemonBatchOptions } from '@/api/query-options'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  PokemonCard,
  PokemonCardSkeleton,
} from '@/components/pokemon/pokemon-card'
import { useFavorites } from '@/hooks/use-favorites'
import { useCompare } from '@/hooks/use-compare'

export const Route = createFileRoute('/favorites')({
  head: () => ({
    meta: [
      { title: 'Favorites - Pokedex' },
      {
        name: 'description',
        content: 'View your favorite Pokemon saved from the Pokedex.',
      },
    ],
  }),
  component: FavoritesPage,
})

function FavoritesPage() {
  const { favorites, toggleFavorite, clearFavorites, isFavorite } =
    useFavorites()
  const { toggleCompare, isInCompare, canAddMore } = useCompare()

  const { data: pokemonList, isLoading } = useQuery({
    ...pokemonBatchOptions(favorites),
    enabled: favorites.length > 0,
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
              <HeartIcon className="size-6 text-red-500" weight="fill" />
              <h1 className="text-2xl font-bold">Your Favorites</h1>
            </div>
          </div>

          {favorites.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFavorites}
              className="text-destructive gap-1.5"
            >
              <TrashIcon />
              Clear All
            </Button>
          )}
        </div>

        <p className="text-muted-foreground mb-6 text-sm">
          {favorites.length} Pokemon saved
        </p>

        {/* Content */}
        {favorites.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HeartIcon />
              </EmptyMedia>
              <EmptyTitle>No favorites yet</EmptyTitle>
              <EmptyDescription>
                Start adding Pokemon to your favorites by clicking the heart
                icon on any Pokemon card.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {favorites.map((id) => (
              <PokemonCardSkeleton key={id} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {pokemonList?.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                id={pokemon.id}
                name={pokemon.name}
                types={pokemon.types}
                isFavorite={isFavorite(pokemon.id)}
                isInCompare={isInCompare(pokemon.id)}
                onFavoriteToggle={() =>
                  toggleFavorite(pokemon.id, pokemon.name)
                }
                onCompareToggle={() => toggleCompare(pokemon.id, pokemon.name)}
                canAddToCompare={canAddMore}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
