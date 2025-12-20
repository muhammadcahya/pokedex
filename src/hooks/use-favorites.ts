import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { STORAGE_KEYS } from '@/lib/constants'

export interface UseFavoritesReturn {
  favorites: Array<number>
  addFavorite: (id: number, name?: string) => void
  removeFavorite: (id: number, name?: string) => void
  toggleFavorite: (id: number, name?: string) => void
  isFavorite: (id: number) => boolean
  clearFavorites: () => void
  favoritesCount: number
}

function getStoredFavorites(): Array<number> {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.favorites)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Array<number>>(getStoredFavorites)

  // Sync with localStorage on mount (for SSR hydration)
  useEffect(() => {
    setFavorites(getStoredFavorites())
  }, [])

  // Persist to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites))
  }, [favorites])

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

  const toggleFavorite = useCallback((id: number, name?: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        toast.success(
          name ? `${name} removed from favorites` : 'Removed from favorites',
        )
        return prev.filter((fav) => fav !== id)
      }
      toast.success(
        name ? `${name} added to favorites!` : 'Added to favorites!',
      )
      return [...prev, id]
    })
  }, [])

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites],
  )

  const clearFavorites = useCallback(() => {
    setFavorites([])
    toast.success('All favorites cleared')
  }, [])

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  }
}
