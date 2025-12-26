import { USE_TANSTACK_DB } from '@/lib/constants'
import { useFavorites as useFavoritesContext } from '@/contexts/favorites-context'
import { useFavoritesDb } from '@/db/hooks/use-favorites-db'

/**
 * Unified favorites hook
 *
 * Switches between implementations based on USE_TANSTACK_DB feature flag:
 * - Default (false): Uses React Context implementation
 * - VITE_USE_TANSTACK_DB=true: Uses TanStack DB implementation
 *
 * Both implementations provide the same API:
 * - favorites: Array<number>
 * - addFavorite: (id: number, name?: string) => void
 * - removeFavorite: (id: number, name?: string) => void
 * - toggleFavorite: (id: number, name?: string) => void
 * - isFavorite: (id: number) => boolean
 * - clearFavorites: () => void
 * - favoritesCount: number
 */
export const useFavorites = USE_TANSTACK_DB
  ? useFavoritesDb
  : useFavoritesContext
