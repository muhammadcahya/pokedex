import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { MAX_COMPARE_POKEMON, STORAGE_KEYS } from '@/lib/constants'

export interface UseCompareReturn {
  compareList: Array<number>
  addToCompare: (id: number, name?: string) => void
  removeFromCompare: (id: number, name?: string) => void
  toggleCompare: (id: number, name?: string) => void
  isInCompare: (id: number) => boolean
  clearCompare: () => void
  canAddMore: boolean
  compareCount: number
}

function getStoredCompare(): Array<number> {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.compare)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function useCompare(): UseCompareReturn {
  const [compareList, setCompareList] =
    useState<Array<number>>(getStoredCompare)

  // Sync with localStorage on mount (for SSR hydration)
  useEffect(() => {
    setCompareList(getStoredCompare())
  }, [])

  // Persist to localStorage whenever compare list changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.compare, JSON.stringify(compareList))
  }, [compareList])

  const canAddMore = compareList.length < MAX_COMPARE_POKEMON

  const addToCompare = useCallback(
    (id: number, name?: string) => {
      if (!canAddMore) {
        toast.error(`You can only compare up to ${MAX_COMPARE_POKEMON} Pokemon`)
        return
      }

      setCompareList((prev) => {
        if (prev.includes(id)) return prev
        return [...prev, id]
      })
      toast.success(name ? `${name} added to compare!` : 'Added to compare!')
    },
    [canAddMore],
  )

  const removeFromCompare = useCallback((id: number, name?: string) => {
    setCompareList((prev) => prev.filter((item) => item !== id))
    toast.success(
      name ? `${name} removed from compare` : 'Removed from compare',
    )
  }, [])

  const toggleCompare = useCallback((id: number, name?: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        toast.success(
          name ? `${name} removed from compare` : 'Removed from compare',
        )
        return prev.filter((item) => item !== id)
      }

      if (prev.length >= MAX_COMPARE_POKEMON) {
        toast.error(`You can only compare up to ${MAX_COMPARE_POKEMON} Pokemon`)
        return prev
      }

      toast.success(name ? `${name} added to compare!` : 'Added to compare!')
      return [...prev, id]
    })
  }, [])

  const isInCompare = useCallback(
    (id: number) => compareList.includes(id),
    [compareList],
  )

  const clearCompare = useCallback(() => {
    setCompareList([])
    toast.success('Compare list cleared')
  }, [])

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
