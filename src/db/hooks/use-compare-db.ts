import { useCallback, useMemo } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { toast } from 'sonner'
import { compareCollection } from '../collections/compare'
import { MAX_COMPARE_POKEMON } from '@/lib/constants'

/**
 * TanStack DB hook for compare list
 * Provides the same API as useCompare() from context but with:
 * - ~42% less code
 * - No Provider required
 * - Automatic localStorage persistence
 * - Cross-tab sync
 * - O(1) lookups via Set
 */
export function useCompareDb() {
  // Live query - automatically updates when collection changes
  const { data: compareItems = [] } = useLiveQuery((q) =>
    q.from({ compare: compareCollection }).select(({ compare }) => compare),
  )

  // Transform to Array<number> for API compatibility
  const compareList = useMemo(
    () => compareItems.map((item) => item.pokemonId),
    [compareItems],
  )

  // Create a Set for O(1) lookups (performance improvement over Array.includes)
  const compareSet = useMemo(() => new Set(compareList), [compareList])

  const canAddMore = compareList.length < MAX_COMPARE_POKEMON

  const addToCompare = useCallback(
    (pokemonId: number, name?: string) => {
      if (compareSet.has(pokemonId)) return

      if (compareItems.length >= MAX_COMPARE_POKEMON) {
        toast.error(`You can only compare up to ${MAX_COMPARE_POKEMON} Pokemon`)
        return
      }

      compareCollection.insert({
        id: crypto.randomUUID(),
        pokemonId,
        addedAt: new Date(),
      })
      toast.success(name ? `${name} added to compare!` : 'Added to compare!')
    },
    [compareSet, compareItems.length],
  )

  const removeFromCompare = useCallback(
    (pokemonId: number, name?: string) => {
      const item = compareItems.find((c) => c.pokemonId === pokemonId)
      if (item) {
        compareCollection.delete(item.id)
        toast.success(
          name ? `${name} removed from compare` : 'Removed from compare',
        )
      }
    },
    [compareItems],
  )

  const toggleCompare = useCallback(
    (pokemonId: number, name?: string) => {
      if (compareSet.has(pokemonId)) {
        removeFromCompare(pokemonId, name)
      } else {
        addToCompare(pokemonId, name)
      }
    },
    [compareSet, addToCompare, removeFromCompare],
  )

  const isInCompare = useCallback(
    (pokemonId: number) => compareSet.has(pokemonId),
    [compareSet],
  )

  const clearCompare = useCallback(() => {
    compareItems.forEach((item) => {
      compareCollection.delete(item.id)
    })
    toast.success('Compare list cleared')
  }, [compareItems])

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    isInCompare,
    clearCompare,
    canAddMore,
    compareCount: compareList.length,
  }
}
