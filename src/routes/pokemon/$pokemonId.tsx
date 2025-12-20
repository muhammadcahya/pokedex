import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretLeftIcon,
  CheckIcon,
  HeartIcon,
  PlusIcon,
} from '@phosphor-icons/react'
import {
  pokemonDetailsOptions,
  pokemonSpeciesOptions,
} from '@/api/query-options'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { PokemonTypes } from '@/components/pokemon/pokemon-types'
import { PokemonStats } from '@/components/pokemon/pokemon-stats'
import { PokemonAbilities } from '@/components/pokemon/pokemon-abilities'
import { PokemonWeaknesses } from '@/components/pokemon/pokemon-weaknesses'
import { PokemonEvolution } from '@/components/pokemon/pokemon-evolution'
import { PokemonCryPlayer } from '@/components/pokemon/pokemon-cry-player'
import { PokemonSpritesGallery } from '@/components/pokemon/pokemon-sprites'
import { useFavorites } from '@/hooks/use-favorites'
import { useCompare } from '@/hooks/use-compare'
import {
  formatHeight,
  formatPokemonId,
  formatPokemonName,
  formatWeight,
} from '@/lib/pokemon-utils'
import {
  TOTAL_POKEMON,
  formatGeneration,
  getGenerationForPokemonId,
} from '@/lib/generation-data'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/pokemon/$pokemonId')({
  loader: async ({ context, params }) => {
    // Prefetch Pokemon data
    await Promise.all([
      context.queryClient.ensureQueryData(
        pokemonDetailsOptions(params.pokemonId),
      ),
      context.queryClient.ensureQueryData(
        pokemonSpeciesOptions(params.pokemonId),
      ),
    ])
  },
  component: PokemonDetailPage,
})

function PokemonDetailPage() {
  const { pokemonId } = Route.useParams()

  const { data: pokemon } = useSuspenseQuery(pokemonDetailsOptions(pokemonId))
  const { data: species } = useQuery(pokemonSpeciesOptions(pokemonId))

  const { toggleFavorite, isFavorite } = useFavorites()
  const { toggleCompare, isInCompare, canAddMore } = useCompare()

  const pokemonIdNum = pokemon.id
  const prevId = pokemonIdNum > 1 ? pokemonIdNum - 1 : null
  const nextId = pokemonIdNum < TOTAL_POKEMON ? pokemonIdNum + 1 : null

  const generation = getGenerationForPokemonId(pokemonIdNum)

  // Get English flavor text
  const flavorText = species?.flavor_text_entries
    .find((entry) => entry.language.name === 'en')
    ?.flavor_text.replace(/\f/g, ' ')
    .replace(/\n/g, ' ')

  // Get English genus (e.g., "Seed Pokemon")
  const genus = species?.genera.find((g) => g.language.name === 'en')?.genus

  const isFav = isFavorite(pokemonIdNum)
  const isCompare = isInCompare(pokemonIdNum)

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{formatPokemonName(pokemon.name)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          render={<Link to="/" />}
          className="mb-4"
        >
          <CaretLeftIcon />
          Back to Pokedex
        </Button>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column - Image */}
          <div>
            <PokemonSpritesGallery
              sprites={pokemon.sprites}
              pokemonName={pokemon.name}
            />

            {/* Cry player */}
            <div className="mt-4 flex justify-center">
              <PokemonCryPlayer
                latestCry={pokemon.cries.latest}
                legacyCry={pokemon.cries.legacy}
              />
            </div>
          </div>

          {/* Right column - Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  {formatPokemonId(pokemonIdNum)}
                </p>
                <h1 className="text-3xl font-bold">
                  {formatPokemonName(pokemon.name)}
                </h1>
                {genus && <p className="text-muted-foreground mt-1">{genus}</p>}
              </div>

              <div className="flex gap-2">
                <Button
                  variant={isFav ? 'default' : 'outline'}
                  size="icon"
                  onClick={() =>
                    toggleFavorite(
                      pokemonIdNum,
                      formatPokemonName(pokemon.name),
                    )
                  }
                  className={cn(isFav && 'bg-red-500 hover:bg-red-600')}
                >
                  <HeartIcon weight={isFav ? 'fill' : 'regular'} />
                </Button>

                <Button
                  variant={isCompare ? 'default' : 'outline'}
                  size="icon"
                  onClick={() =>
                    toggleCompare(pokemonIdNum, formatPokemonName(pokemon.name))
                  }
                  disabled={!isCompare && !canAddMore}
                >
                  {isCompare ? <CheckIcon weight="bold" /> : <PlusIcon />}
                </Button>
              </div>
            </div>

            {/* Types */}
            <div>
              <h2 className="mb-2 text-sm font-medium">Type</h2>
              <PokemonTypes types={pokemon.types} clickable size="lg" />
            </div>

            {/* About */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {flavorText && (
                  <p className="text-muted-foreground text-sm">{flavorText}</p>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Height</span>
                    <p className="font-medium">
                      {formatHeight(pokemon.height)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Weight</span>
                    <p className="font-medium">
                      {formatWeight(pokemon.weight)}
                    </p>
                  </div>
                  {generation && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Generation</span>
                      <p className="font-medium">
                        {formatGeneration(generation)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Base Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Base Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <PokemonStats stats={pokemon.stats} />
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Weaknesses</CardTitle>
              </CardHeader>
              <CardContent>
                <PokemonWeaknesses types={pokemon.types} clickable />
              </CardContent>
            </Card>

            {/* Abilities */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Abilities</CardTitle>
              </CardHeader>
              <CardContent>
                <PokemonAbilities abilities={pokemon.abilities} clickable />
              </CardContent>
            </Card>

            {/* Evolution */}
            {species?.evolution_chain && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Evolution</CardTitle>
                </CardHeader>
                <CardContent>
                  <PokemonEvolution
                    evolutionChainUrl={species.evolution_chain.url}
                    currentPokemonId={pokemonIdNum}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t pt-6">
          {prevId ? (
            <Button
              variant="outline"
              render={
                <Link
                  to="/pokemon/$pokemonId"
                  params={{ pokemonId: String(prevId) }}
                />
              }
            >
              <ArrowLeftIcon />
              Previous
            </Button>
          ) : (
            <div />
          )}

          {nextId && (
            <Button
              variant="outline"
              render={
                <Link
                  to="/pokemon/$pokemonId"
                  params={{ pokemonId: String(nextId) }}
                />
              }
            >
              Next
              <ArrowRightIcon />
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
