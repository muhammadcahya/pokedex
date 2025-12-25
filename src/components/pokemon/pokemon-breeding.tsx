import { GenderFemaleIcon, GenderMaleIcon } from '@phosphor-icons/react'
import type { PokemonSpecies } from '@/types/species'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPokemonName } from '@/lib/pokemon-utils'

interface PokemonBreedingProps {
  species?: PokemonSpecies
}

export function PokemonBreeding({ species }: PokemonBreedingProps) {
  if (!species) return null

  // gender_rate: The chance of this Pokémon being female, in eighths;
  // or -1 for genderless
  const genderRate = species.gender_rate

  let genderContent
  if (genderRate === -1) {
    genderContent = <span className="text-muted-foreground">Genderless</span>
  } else {
    const femalePercentage = (genderRate / 8) * 100
    const malePercentage = 100 - femalePercentage

    genderContent = (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-blue-500">
          <GenderMaleIcon weight="bold" />
          <span>{malePercentage}%</span>
        </div>
        <div className="flex items-center gap-1 text-pink-500">
          <GenderFemaleIcon weight="bold" />
          <span>{femalePercentage}%</span>
        </div>
      </div>
    )
  }

  // Hatch counter: Initial hatch counter: one must walk 255 × (hatch_counter + 1) steps before this Pokémon's egg hatches
  const steps = 255 * (species.hatch_counter + 1)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Breeding</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground mb-1 block">Gender</span>
            <div className="font-medium">{genderContent}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">Egg Groups</span>
              <div className="font-medium">
                {species.egg_groups.map((group, index) => (
                  <span key={group.name}>
                    {formatPokemonName(group.name)}
                    {index < species.egg_groups.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-muted-foreground">Egg Cycles</span>
              <p className="font-medium">
                {species.hatch_counter}{' '}
                <span className="text-muted-foreground text-xs">
                  ({steps} steps)
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
