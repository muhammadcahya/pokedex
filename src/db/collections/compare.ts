import {
  createCollection,
  localStorageCollectionOptions,
} from '@tanstack/react-db'
import type { CompareItem } from '../types'

/**
 * TanStack DB collection for compare list
 * - Automatically persists to localStorage
 * - Cross-tab sync via storage events
 * - No hydration management needed
 */
export const compareCollection = createCollection(
  localStorageCollectionOptions<CompareItem, string>({
    id: 'pokedex-compare-db',
    storageKey: 'pokedex-compare-db', // Different key to avoid conflicts with old implementation
    getKey: (item) => item.id,
  }),
)
