/**
 * TanStack DB Types for Favorites and Compare Collections
 */

/**
 * Item stored in favorites collection
 */
export interface FavoriteItem {
  id: string // UUID for collection key
  pokemonId: number // The Pokemon ID
  addedAt: Date // Timestamp when added
}

/**
 * Item stored in compare collection
 */
export interface CompareItem {
  id: string // UUID for collection key
  pokemonId: number // The Pokemon ID
  addedAt: Date // Timestamp when added
}
