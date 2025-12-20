import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { HeartIcon, ScalesIcon, ShuffleIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useFavorites } from '@/hooks/use-favorites'
import { useCompare } from '@/hooks/use-compare'
import { getRandomPokemonId } from '@/lib/pokemon-utils'

export function Header() {
  const { favoritesCount } = useFavorites()
  const { compareCount } = useCompare()
  const [isClient, setIsClient] = useState(false)

  // Only show counts on client to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSurpriseMe = () => {
    const randomId = getRandomPokemonId()
    window.location.href = `/pokemon/${randomId}`
  }

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/pokeball-logo.svg" alt="Pokeball" className="size-8" />
          <span className="text-xl font-bold">Pokedex</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSurpriseMe}
            className="gap-1.5"
          >
            <ShuffleIcon className="size-4" />
            <span className="hidden sm:inline">Surprise Me</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            render={<Link to="/favorites" />}
          >
            <HeartIcon className="size-4" weight="fill" />
            <span className="hidden sm:inline">Favorites</span>
            {isClient && favoritesCount > 0 && (
              <span className="bg-primary text-primary-foreground ml-1 rounded-full px-1.5 py-0.5 text-xs">
                {favoritesCount}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            render={<Link to="/compare" />}
          >
            <ScalesIcon className="size-4" />
            <span className="hidden sm:inline">Compare</span>
            {isClient && compareCount > 0 && (
              <span className="bg-primary text-primary-foreground ml-1 rounded-full px-1.5 py-0.5 text-xs">
                {compareCount}
              </span>
            )}
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
