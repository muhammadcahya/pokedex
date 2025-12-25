import { useRef, useState } from 'react'
import { PauseIcon, SpeakerHighIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PokemonCryPlayerProps {
  latestCry: string
  legacyCry?: string
  className?: string
}

export function PokemonCryPlayer({
  latestCry,
  legacyCry,
  className,
}: PokemonCryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [useLegacy, setUseLegacy] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentCry = useLegacy && legacyCry ? legacyCry : latestCry

  const handlePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <audio
        ref={audioRef}
        src={currentCry}
        onEnded={handleEnded}
        preload="none"
      />

      <Button
        variant="outline"
        size="sm"
        onClick={handlePlay}
        className="gap-1.5"
      >
        {isPlaying ? (
          <>
            <PauseIcon weight="fill" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <SpeakerHighIcon />
            <span>Play Cry</span>
          </>
        )}
      </Button>

      {legacyCry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setUseLegacy(!useLegacy)}
          className={cn(
            'text-muted-foreground text-xs',
            useLegacy && 'text-foreground',
          )}
        >
          {useLegacy ? 'Legacy' : 'Latest'}
        </Button>
      )}
    </div>
  )
}
