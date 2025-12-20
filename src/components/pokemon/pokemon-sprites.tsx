import { useState } from 'react'
import type { PokemonSprites } from '@/types/pokemon'
import { cn } from '@/lib/utils'

interface PokemonSpritesGalleryProps {
  sprites: PokemonSprites
  pokemonName: string
  className?: string
}

type SpriteVariant = 'default' | 'shiny'

export function PokemonSpritesGallery({
  sprites,
  pokemonName,
  className,
}: PokemonSpritesGalleryProps) {
  const [variant, setVariant] = useState<SpriteVariant>('default')

  const mainImage =
    variant === 'shiny'
      ? sprites.other['official-artwork'].front_shiny
      : sprites.other['official-artwork'].front_default

  const hasShiny = !!sprites.other['official-artwork'].front_shiny

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main image */}
      <div className="bg-muted/30 flex aspect-square items-center justify-center rounded-2xl p-4">
        {mainImage ? (
          <img
            src={mainImage}
            alt={`${pokemonName} ${variant}`}
            className="h-full w-full object-contain drop-shadow-lg"
          />
        ) : (
          <div className="text-muted-foreground text-sm">
            No image available
          </div>
        )}
      </div>

      {/* Variant toggle */}
      {hasShiny && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setVariant('default')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
              variant === 'default'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80',
            )}
          >
            Default
          </button>
          <button
            onClick={() => setVariant('shiny')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
              variant === 'shiny'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80',
            )}
          >
            Shiny
          </button>
        </div>
      )}

      {/* Sprite thumbnails */}
      <div className="flex flex-wrap justify-center gap-2">
        {sprites.front_default && (
          <SpriteThumb
            src={sprites.front_default}
            alt={`${pokemonName} front`}
            label="Front"
          />
        )}
        {sprites.back_default && (
          <SpriteThumb
            src={sprites.back_default}
            alt={`${pokemonName} back`}
            label="Back"
          />
        )}
        {sprites.front_shiny && (
          <SpriteThumb
            src={sprites.front_shiny}
            alt={`${pokemonName} shiny front`}
            label="Shiny"
          />
        )}
        {sprites.front_female && (
          <SpriteThumb
            src={sprites.front_female}
            alt={`${pokemonName} female`}
            label="Female"
          />
        )}
      </div>
    </div>
  )
}

function SpriteThumb({
  src,
  alt,
  label,
}: {
  src: string
  alt: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-muted/50 flex size-12 items-center justify-center rounded-lg">
        <img src={src} alt={alt} className="size-10" />
      </div>
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  )
}
