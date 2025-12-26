import { USE_TANSTACK_DB } from '@/lib/constants'
import { useCompare as useCompareContext } from '@/contexts/compare-context'
import { useCompareDb } from '@/db/hooks/use-compare-db'

/**
 * Unified compare hook
 *
 * Switches between implementations based on USE_TANSTACK_DB feature flag:
 * - Default (false): Uses React Context implementation
 * - VITE_USE_TANSTACK_DB=true: Uses TanStack DB implementation
 *
 * Both implementations provide the same API:
 * - compareList: Array<number>
 * - addToCompare: (id: number, name?: string) => void
 * - removeFromCompare: (id: number, name?: string) => void
 * - toggleCompare: (id: number, name?: string) => void
 * - isInCompare: (id: number) => boolean
 * - clearCompare: () => void
 * - canAddMore: boolean
 * - compareCount: number
 */
export const useCompare = USE_TANSTACK_DB ? useCompareDb : useCompareContext
