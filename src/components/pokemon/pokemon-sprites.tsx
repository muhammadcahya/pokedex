import { useState } from 'react'
import type { PokemonSprites } from '@/types/pokemon'
import { cn } from '@/lib/utils'

interface PokemonSpritesGalleryProps {
  sprites: PokemonSprites
  pokemonName: string
  className?: string
}

interface SpriteOption {
  src: string | null
  alt: string
  label: string
}

export function PokemonSpritesGallery({
  sprites,
  pokemonName,
  className,
}: PokemonSpritesGalleryProps) {
  // Collect all available sprites
  const allSprites: Array<SpriteOption> = [
    {
      src: sprites.other['official-artwork'].front_default,
      alt: `${pokemonName} official artwork`,
      label: 'Official',
    },
    {
      src: sprites.other['official-artwork'].front_shiny,
      alt: `${pokemonName} shiny official artwork`,
      label: 'Shiny Art',
    },
    {
      src: sprites.front_default,
      alt: `${pokemonName} front`,
      label: 'Front',
    },
    {
      src: sprites.back_default,
      alt: `${pokemonName} back`,
      label: 'Back',
    },
    {
      src: sprites.front_shiny,
      alt: `${pokemonName} shiny front`,
      label: 'Shiny',
    },
    {
      src: sprites.back_shiny,
      alt: `${pokemonName} shiny back`,
      label: 'Shiny Back',
    },
    {
      src: sprites.front_female,
      alt: `${pokemonName} female`,
      label: 'Female',
    },
    {
      src: sprites.back_female,
      alt: `${pokemonName} female back`,
      label: 'Female Back',
    },
    {
      src: sprites.front_shiny_female,
      alt: `${pokemonName} shiny female`,
      label: 'Shiny ♀',
    },
    {
      src: sprites.back_shiny_female,
      alt: `${pokemonName} shiny female back`,
      label: 'Shiny ♀ Back',
    },
  ].filter((sprite) => sprite.src !== null)

  const [selectedIndex, setSelectedIndex] = useState(0)

  if (allSprites.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="bg-muted/30 flex aspect-square items-center justify-center rounded-2xl p-4">
          <div className="text-muted-foreground text-sm">
            No image available
          </div>
        </div>
      </div>
    )
  }

  const selectedSprite = allSprites[selectedIndex] ?? allSprites[0]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main image */}
      <div className="bg-muted/30 flex aspect-square items-center justify-center rounded-2xl p-4">
        {selectedSprite.src && (
          <img
            src={selectedSprite.src}
            alt={selectedSprite.alt}
            className="max-h-full max-w-full object-contain drop-shadow-lg"
          />
        )}
      </div>

      {/* Sprite thumbnails - all clickable */}
      {allSprites.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {allSprites.map((sprite, index) => (
            <button
              key={sprite.label}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg p-1 transition-all',
                selectedIndex === index
                  ? 'bg-primary/10 ring-primary ring-2'
                  : 'hover:bg-muted',
              )}
            >
              <div className="bg-muted/50 flex size-12 items-center justify-center rounded-lg">
                <img
                  src={sprite.src!}
                  alt={sprite.alt}
                  className="size-10 object-contain"
                />
              </div>
              <span
                className={cn(
                  'text-xs',
                  selectedIndex === index
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground',
                )}
              >
                {sprite.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
