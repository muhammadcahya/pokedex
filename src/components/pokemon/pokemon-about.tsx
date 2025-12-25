import type { GenerationInfo } from '@/lib/generation-data'
import type { Pokemon } from '@/types/pokemon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatGeneration } from '@/lib/generation-data'
import { formatHeight, formatWeight } from '@/lib/pokemon-utils'

interface PokemonAboutProps {
  pokemon: Pokemon
  generation?: GenerationInfo | null
  flavorText?: string
}

export function PokemonAbout({
  pokemon,
  generation,
  flavorText,
}: PokemonAboutProps) {
  return (
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
            <p className="font-medium">{formatHeight(pokemon.height)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Weight</span>
            <p className="font-medium">{formatWeight(pokemon.weight)}</p>
          </div>
          {generation && (
            <div>
              <span className="text-muted-foreground">Generation</span>
              <p className="font-medium">{formatGeneration(generation)}</p>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Base Exp</span>
            <p className="font-medium">{pokemon.base_experience}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
