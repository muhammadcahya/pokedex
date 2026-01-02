import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
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
import { PokemonAbout } from '@/components/pokemon/pokemon-about'
import { PokemonTraining } from '@/components/pokemon/pokemon-training'
import { PokemonBreeding } from '@/components/pokemon/pokemon-breeding'
import { PokemonHeldItems } from '@/components/pokemon/pokemon-held-items'
import { useFavorites } from '@/hooks/use-favorites'
import { useCompare } from '@/hooks/use-compare'
import { formatPokemonId, formatPokemonName } from '@/lib/pokemon-utils'
import { TOTAL_POKEMON, getGenerationForPokemonId } from '@/lib/generation-data'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/pokemon/$pokemonId')({
  loader: async ({ context, params }) => {
    // Prefetch Pokemon data
    const pokemon = await context.queryClient.ensureQueryData(
      pokemonDetailsOptions(params.pokemonId),
    )
    await context.queryClient.ensureQueryData(
      pokemonSpeciesOptions(params.pokemonId),
    )
    return { pokemon }
  },
  head: ({ loaderData }) => {
    const pokemon = loaderData?.pokemon
    if (!pokemon) {
      return {
        meta: [
          { title: 'Pokemon - Pokedex' },
          { name: 'description', content: 'Pokemon details' },
        ],
      }
    }
    const name = formatPokemonName(pokemon.name)
    const id = formatPokemonId(pokemon.id)
    return {
      meta: [
        { title: `${name} ${id} - Pokedex` },
        {
          name: 'description',
          content: `View details, stats, evolutions, and abilities of ${name} (${id})`,
        },
      ],
    }
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
        {/* Navigation Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex-1">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {generation && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        render={
                          <Link
                            to="/"
                            search={{ regions: generation.region }}
                          />
                        }
                      >
                        {generation.region}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {formatPokemonName(pokemon.name)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!prevId}
              render={
                prevId ? (
                  <Link
                    to="/pokemon/$pokemonId"
                    params={{ pokemonId: String(prevId) }}
                  />
                ) : undefined
              }
              nativeButton={false}
              aria-label="Previous Pokemon"
            >
              <ArrowLeftIcon />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!nextId}
              render={
                nextId ? (
                  <Link
                    to="/pokemon/$pokemonId"
                    params={{ pokemonId: String(nextId) }}
                  />
                ) : undefined
              }
              nativeButton={false}
              aria-label="Next Pokemon"
            >
              Next
              <ArrowRightIcon />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            {/* Sprites */}
            <div
              style={{ viewTransitionName: `pokemon-image-${pokemonIdNum}` }}
            >
              <PokemonSpritesGallery
                sprites={pokemon.sprites}
                pokemonName={pokemon.name}
              />
            </div>

            {/* Cry player */}
            <div className="flex justify-center">
              <PokemonCryPlayer
                latestCry={pokemon.cries.latest}
                legacyCry={pokemon.cries.legacy}
              />
            </div>

            {/* Base Stats - Moved to Left */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Base Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  data-testid="pokemon-stats"
                  style={{
                    viewTransitionName: `pokemon-stats-${pokemonIdNum}`,
                  }}
                >
                  <PokemonStats stats={pokemon.stats} />
                </div>
              </CardContent>
            </Card>

            {/* Held Items - New */}
            <PokemonHeldItems heldItems={pokemon.held_items} />
          </div>

          {/* Right column - Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  {formatPokemonId(pokemonIdNum)}
                </p>
                <h1
                  className="text-3xl font-bold"
                  style={{ viewTransitionName: `pokemon-name-${pokemonIdNum}` }}
                >
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
                  style={
                    isFav
                      ? {
                          viewTransitionName: `pokemon-favorite-${pokemonIdNum}`,
                        }
                      : undefined
                  }
                  aria-label={
                    isFav ? 'Remove from favorites' : 'Add to favorites'
                  }
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
                  style={
                    isCompare
                      ? {
                          viewTransitionName: `pokemon-compare-${pokemonIdNum}`,
                        }
                      : undefined
                  }
                  aria-label={
                    isCompare ? 'Remove from compare' : 'Add to compare'
                  }
                >
                  {isCompare ? <CheckIcon weight="bold" /> : <PlusIcon />}
                </Button>
              </div>
            </div>

            {/* Types */}
            <div>
              <h2 className="mb-2 text-sm font-medium">Type</h2>
              <div
                data-testid="pokemon-type"
                style={{ viewTransitionName: `pokemon-types-${pokemonIdNum}` }}
              >
                <PokemonTypes types={pokemon.types} clickable size="lg" />
              </div>
            </div>

            {/* About - Enhanced */}
            <PokemonAbout
              pokemon={pokemon}
              generation={generation}
              flavorText={flavorText}
            />

            {/* Training - New */}
            <PokemonTraining
              species={species}
              baseExp={pokemon.base_experience}
            />

            {/* Breeding - New */}
            <PokemonBreeding species={species} />

            {/* Weaknesses */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Weaknesses</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  style={{
                    viewTransitionName: `pokemon-weaknesses-${pokemonIdNum}`,
                  }}
                >
                  <PokemonWeaknesses types={pokemon.types} clickable />
                </div>
              </CardContent>
            </Card>

            {/* Abilities */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Abilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  style={{
                    viewTransitionName: `pokemon-abilities-${pokemonIdNum}`,
                  }}
                >
                  <PokemonAbilities abilities={pokemon.abilities} clickable />
                </div>
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
              nativeButton={false}
              aria-label="Previous Pokemon"
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
              nativeButton={false}
              aria-label="Next Pokemon"
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
