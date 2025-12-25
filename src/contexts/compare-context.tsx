import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { toast } from 'sonner'
import type { ReactNode } from 'react'
import { MAX_COMPARE_POKEMON, STORAGE_KEYS } from '@/lib/constants'

interface CompareContextValue {
  compareList: Array<number>
  addToCompare: (id: number, name?: string) => void
  removeFromCompare: (id: number, name?: string) => void
  toggleCompare: (id: number, name?: string) => void
  isInCompare: (id: number) => boolean
  clearCompare: () => void
  canAddMore: boolean
  compareCount: number
}

const CompareContext = createContext<CompareContextValue | null>(null)

function getStoredCompare(): Array<number> {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.compare)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Array<number>>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setCompareList(getStoredCompare())
    setIsHydrated(true)
  }, [])

  // Persist to localStorage whenever compare list changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEYS.compare, JSON.stringify(compareList))
    }
  }, [compareList, isHydrated])

  const canAddMore = compareList.length < MAX_COMPARE_POKEMON

  const addToCompare = useCallback(
    (id: number, name?: string) => {
      setCompareList((prev) => {
        if (prev.includes(id)) return prev
        if (prev.length >= MAX_COMPARE_POKEMON) {
          toast.error(
            `You can only compare up to ${MAX_COMPARE_POKEMON} Pokemon`,
          )
          return prev
        }
        return [...prev, id]
      })
      if (compareList.length < MAX_COMPARE_POKEMON) {
        toast.success(name ? `${name} added to compare!` : 'Added to compare!')
      }
    },
    [compareList.length],
  )

  const removeFromCompare = useCallback((id: number, name?: string) => {
    setCompareList((prev) => prev.filter((item) => item !== id))
    toast.success(
      name ? `${name} removed from compare` : 'Removed from compare',
    )
  }, [])

  const toggleCompare = useCallback(
    (id: number, name?: string) => {
      const isCurrentlyInCompare = compareList.includes(id)
      if (isCurrentlyInCompare) {
        removeFromCompare(id, name)
      } else {
        addToCompare(id, name)
      }
    },
    [compareList, addToCompare, removeFromCompare],
  )

  const isInCompare = useCallback(
    (id: number) => compareList.includes(id),
    [compareList],
  )

  const clearCompare = useCallback(() => {
    setCompareList([])
    toast.success('Compare list cleared')
  }, [])

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        canAddMore,
        compareCount: compareList.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare(): CompareContextValue {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider')
  }
  return context
}
