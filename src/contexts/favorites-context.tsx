import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { toast } from 'sonner'
import type { ReactNode } from 'react'
import { STORAGE_KEYS } from '@/lib/constants'

interface FavoritesContextValue {
  favorites: Array<number>
  addFavorite: (id: number, name?: string) => void
  removeFavorite: (id: number, name?: string) => void
  toggleFavorite: (id: number, name?: string) => void
  isFavorite: (id: number) => boolean
  clearFavorites: () => void
  favoritesCount: number
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function getStoredFavorites(): Array<number> {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.favorites)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Array<number>>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setFavorites(getStoredFavorites())
    setIsHydrated(true)
  }, [])

  // Persist to localStorage whenever favorites change (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites))
    }
  }, [favorites, isHydrated])

  const addFavorite = useCallback((id: number, name?: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev
      return [...prev, id]
    })
    toast.success(name ? `${name} added to favorites!` : 'Added to favorites!')
  }, [])

  const removeFavorite = useCallback((id: number, name?: string) => {
    setFavorites((prev) => prev.filter((fav) => fav !== id))
    toast.success(
      name ? `${name} removed from favorites` : 'Removed from favorites',
    )
  }, [])

  const toggleFavorite = useCallback(
    (id: number, name?: string) => {
      const isCurrentlyFavorite = favorites.includes(id)
      if (isCurrentlyFavorite) {
        removeFavorite(id, name)
      } else {
        addFavorite(id, name)
      }
    },
    [favorites, addFavorite, removeFavorite],
  )

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites],
  )

  const clearFavorites = useCallback(() => {
    setFavorites([])
    toast.success('All favorites cleared')
  }, [])

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
