import type { PokemonHeldItem } from '@/types/pokemon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPokemonName } from '@/lib/pokemon-utils'

interface PokemonHeldItemsProps {
  heldItems: Array<PokemonHeldItem>
}

export function PokemonHeldItems({ heldItems }: PokemonHeldItemsProps) {
  if (heldItems.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Held Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {heldItems.map((item) => (
            <div
              key={item.item.name}
              className="bg-muted flex items-center gap-2 rounded-md px-3 py-2"
            >
              {/* Placeholder for item image if we had a way to get it easily without another request, 
                        or we could just use the text. PokeAPI item sprites are usually at 
                        https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/{name}.png 
                    */}
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.item.name}.png`}
                alt={item.item.name}
                className="h-6 w-6 object-contain"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
              <span className="text-sm font-medium capitalize">
                {formatPokemonName(item.item.name)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
