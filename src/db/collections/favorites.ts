import {
  createCollection,
  localStorageCollectionOptions,
} from '@tanstack/react-db'
import type { FavoriteItem } from '../types'

/**
 * TanStack DB collection for favorites
 * - Automatically persists to localStorage
 * - Cross-tab sync via storage events
 * - No hydration management needed
 */
export const favoritesCollection = createCollection(
  localStorageCollectionOptions<FavoriteItem, string>({
    id: 'pokedex-favorites-db',
    storageKey: 'pokedex-favorites-db', // Different key to avoid conflicts with old implementation
    getKey: (item) => item.id,
  }),
)
