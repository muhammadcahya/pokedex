import type { PokemonSpecies } from '@/types/species'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPokemonName } from '@/lib/pokemon-utils'

interface PokemonTrainingProps {
  species?: PokemonSpecies
  baseExp?: number
}

export function PokemonTraining({ species, baseExp }: PokemonTrainingProps) {
  if (!species) return null

  // Catch Rate (0-255)
  // Higher = easier to catch
  const catchRate = species.capture_rate

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Training</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Catch Rate</span>
            <p className="font-medium">{catchRate}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Base Friendship</span>
            <p className="font-medium">{species.base_happiness}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Growth Rate</span>
            <p className="font-medium">
              {formatPokemonName(species.growth_rate.name)}
            </p>
          </div>
          {baseExp && (
            <div>
              <span className="text-muted-foreground">Base Exp</span>
              <p className="font-medium">{baseExp}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
