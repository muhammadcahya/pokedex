Pokedex Application Implementation Plan

     Overview

     A comprehensive Pokedex application using TanStack Start, TanStack Query, React 19, and shadcn/ui components with PokeAPI integration.

     ---
     File Structure

     src/
     ├── api/
     │   ├── server-functions.ts      # PokeAPI server functions (createServerFn)
     │   └── query-options.ts         # TanStack Query options factory
     ├── components/
     │   ├── pokemon/
     │   │   ├── pokemon-card.tsx     # Card for grid display
     │   │   ├── pokemon-grid.tsx     # Grid layout with pagination
     │   │   ├── pokemon-stats.tsx    # Stats with progress bars
     │   │   ├── pokemon-types.tsx    # Type badges (clickable)
     │   │   ├── pokemon-abilities.tsx # Abilities display
     │   │   ├── pokemon-evolution.tsx # Evolution chain
     │   │   ├── pokemon-cry-player.tsx # Audio player
     │   │   ├── pokemon-sprites.tsx  # Sprite variations
     │   │   └── pokemon-weaknesses.tsx # Weakness badges
     │   ├── filters/
     │   │   ├── filter-panel.tsx     # Main filter container
     │   │   ├── region-filter.tsx    # Generation/Region toggles
     │   │   ├── type-filter.tsx      # Multi-select type badges
     │   │   ├── ability-filter.tsx   # Ability combobox
     │   │   ├── size-filters.tsx     # Height/Weight filters
     │   │   └── sort-dropdown.tsx    # Sort options
     │   ├── compare/
     │   │   ├── compare-card.tsx     # Compare card
     │   │   └── compare-bar.tsx      # Floating compare bar
     │   └── layout/
     │       ├── header.tsx           # Main header
     │       └── search-bar.tsx       # Search input
     ├── hooks/
     │   ├── use-favorites.ts         # Favorites (localStorage)
     │   ├── use-compare.ts           # Compare list (localStorage)
     │   ├── use-filters.ts           # Filter state with URL sync
     │   └── use-infinite-scroll.ts   # Infinite scroll with Intersection Observer
     ├── lib/
     │   ├── type-colors.ts           # Type color mappings
     │   ├── generation-data.ts       # Generation ranges
     │   └── pokemon-utils.ts         # Formatting helpers
     ├── types/
     │   ├── pokemon.ts               # Pokemon types
     │   ├── species.ts               # Species types
     │   └── evolution.ts             # Evolution chain types
     └── routes/
         ├── index.tsx                # Home - Pokemon grid
         ├── pokemon/
         │   └── $pokemonId.tsx       # Detail page
         ├── favorites.tsx            # Favorites page
         └── compare.tsx              # Compare page

     ---
     Routes

     | Route               | Description                       |
     |---------------------|-----------------------------------|
     | /                   | Home with grid, search, filters   |
     | /pokemon/$pokemonId | Pokemon detail page               |
     | /favorites          | Saved favorites                   |
     | /compare            | Side-by-side comparison (up to 4) |

     ---
     API Integration

     Server Functions (src/api/server-functions.ts)

     - getPokemonList(limit, offset) - Paginated list
     - getPokemonDetails(idOrName) - Full Pokemon data
     - getPokemonSpecies(idOrName) - Species/generation/description
     - getEvolutionChain(chainId) - Evolution data
     - getTypeDetails(typeName) - Type with damage_relations
     - getAllAbilities() - All abilities for filter

     Query Options Pattern

     export const getPokemonDetailsOptions = (id: string) =>
       queryOptions({
         queryKey: ['pokemon', id],
         queryFn: () => getPokemonDetails({ data: { idOrName: id } }),
         staleTime: 1000 * 60 * 60, // 1 hour
       })

     ---
     Features

     1. Pokemon Grid (Home Page)

     - Infinite scroll - Load 20 Pokemon initially, more on scroll
     - Search by name/number (debounced 300ms)
     - "Surprise Me" button (random Pokemon)
     - "Showing X of Y Pokemon" counter
     - Sprite images for performance
     - Intersection Observer for detecting scroll position

     2. Advanced Filters (URL-synced, Server-side)

     - Server-side filtering - Lighter initial load, fetch filtered results per change
     - Regions: All, Gen 1-9 with format "Generation 1 (Kanto)"
     - Types: Multi-select (18 types, combinable)
     - Ability: Searchable combobox
     - Height: Small (<1m), Medium (1-2m), Large (>2m)
     - Weight: Light (<50kg), Medium (50-100kg), Heavy (>100kg)
     - Sort: Number, Name, Random

     3. Pokemon Detail Page

     - High-quality artwork image
     - Base stats with progress bars (HP, ATK, DEF, SP.ATK, SP.DEF, SPD, Total)
     - Description from species data
     - Height/Weight with conversions
     - Types (clickable → filter)
     - Weaknesses calculated from type damage_relations (clickable)
     - Abilities with hidden label (clickable)
     - Evolution chain with sprites
     - Cry audio player
     - Sprite gallery (default, shiny, forms)
     - Previous/Next navigation

     4. Favorites System

     - Heart toggle on cards
     - Persisted to localStorage (persists across sessions)
     - Favorites page with grid
     - Toast on add/remove (Sonner)

     5. Compare System

     - Add button on cards (max 4)
     - Persisted to localStorage (persists across sessions)
     - Floating compare bar
     - Side-by-side stats comparison
     - Clear all / remove individual

     ---
     Type Colors (OKLCH)

     const TYPE_COLORS = {
       normal: 'oklch(0.65 0.06 80)',
       fire: 'oklch(0.65 0.18 35)',
       water: 'oklch(0.60 0.15 250)',
       electric: 'oklch(0.85 0.18 95)',
       grass: 'oklch(0.65 0.18 145)',
       ice: 'oklch(0.80 0.12 200)',
       fighting: 'oklch(0.55 0.20 25)',
       poison: 'oklch(0.55 0.20 320)',
       ground: 'oklch(0.70 0.12 70)',
       flying: 'oklch(0.75 0.12 280)',
       psychic: 'oklch(0.65 0.20 350)',
       bug: 'oklch(0.70 0.18 120)',
       rock: 'oklch(0.60 0.10 80)',
       ghost: 'oklch(0.45 0.15 300)',
       dragon: 'oklch(0.50 0.20 280)',
       dark: 'oklch(0.35 0.08 60)',
       steel: 'oklch(0.70 0.04 250)',
       fairy: 'oklch(0.75 0.15 350)',
     }

     ---
     Generation Data

     | Gen | Region | Pokemon IDs |
     |-----|--------|-------------|
     | 1   | Kanto  | 1-151       |
     | 2   | Johto  | 152-251     |
     | 3   | Hoenn  | 252-386     |
     | 4   | Sinnoh | 387-493     |
     | 5   | Unova  | 494-649     |
     | 6   | Kalos  | 650-721     |
     | 7   | Alola  | 722-809     |
     | 8   | Galar  | 810-905     |
     | 9   | Paldea | 906-1025    |

     ---
     Image Strategy

     - List view: sprites.front_default (96x96 sprite)
     - Detail view: sprites.other.official-artwork.front_default (475px)
     - Shiny: sprites.other.official-artwork.front_shiny
     - Preload: On hover via router intent preloading

     ---
     Existing Components to Use

     | Component        | Usage                        |
     |------------------|------------------------------|
     | ui/card          | Pokemon cards, compare cards |
     | ui/button        | All buttons                  |
     | ui/badge         | Type badges                  |
     | ui/progress      | Stats bars                   |
     | ui/tooltip       | Info tooltips                |
     | ui/combobox      | Ability filter               |
     | ui/toggle-group  | Region/size filters          |
     | ui/skeleton      | Loading states               |
     | ui/empty         | Empty state                  |
     | ui/breadcrumb    | Detail page navigation       |
     | ui/sonner        | Toast notifications          |
     | ui/item          | List items                   |
     | ui/dropdown-menu | Sort dropdown                |

     ---
     Implementation Phases

     Phase 1: Foundation

     1. Setup TanStack Query integration (context, provider, SSR)
     2. Create type definitions
     3. Create API layer (server-functions, query-options)
     4. Create utility files (type-colors, generation-data, pokemon-utils)

     Phase 2: Core Components

     5. Create layout (header, search-bar)
     6. Create pokemon components (types, card, grid)
     7. Create home page route (basic grid)

     Phase 3: Detail Page

     8. Create detail components (stats, abilities, weaknesses, evolution, cry-player, sprites)
     9. Create detail page route with loaders

     Phase 4: Filtering

     10. Create filter hooks (use-filters, use-debounce)
     11. Create filter components (all filters)
     12. Update home page with filters and URL sync

     Phase 5: Favorites & Compare

     13. Create favorites hook and page
     14. Create compare hook and components
     15. Add toast notifications

     Phase 6: Polish

     16. Performance optimization (preloading, caching)
     17. Loading/empty states
     18. Run bun check and fix issues
     19. Responsive testing

     ---
     Critical Files

     - src/api/server-functions.ts - All PokeAPI calls
     - src/api/query-options.ts - Query options factory
     - src/routes/index.tsx - Home page with grid and filters
     - src/routes/pokemon/$pokemonId.tsx - Detail page
     - src/hooks/use-favorites.ts - Favorites state
     - src/hooks/use-compare.ts - Compare state
     - src/lib/type-colors.ts - Type color mappings
     - src/lib/generation-data.ts - Generation ranges

     ---
     Post-Implementation Cleanup

     After implementation is complete:
     - Remove plan/ folder to avoid polluting the codebase
     - Remove src/components/component-example.tsx (demo file)
     - Remove src/components/example.tsx (demo wrapper)
     - Verify bun check passes (format, lint, type-check)

## Second

Research Summary

TanStack DB with localStorageCollectionOptions

- Yes, it's possible and well-suited for favorites and compare features
- Package: @tanstack/react-db
- Provides reactive collections with automatic localStorage persistence

Key Differences from Current Implementation

| Aspect             | Current (React Context)       | TanStack DB                |
| ------------------ | ----------------------------- | -------------------------- |
| Lines of code      | ~112 lines each               | ~65 lines each (~42% less) |
| Hydration          | Manual (useState + useEffect) | Automatic                  |
| localStorage sync  | Manual (useEffect)            | Built-in                   |
| Provider needed    | Yes                           | No (singleton)             |
| Cross-tab sync     | Not implemented               | Built-in                   |
| Lookup performance | O(n) with Array.includes      | O(1) with Set              |

What Can Be Optimized

1. Eliminate hydration boilerplate (~15 lines per feature)
2. Eliminate manual localStorage sync (~8 lines per feature)
3. Eliminate Provider components (~15 lines per feature)
4. Improve lookup from O(n) to O(1)

The implementation will keep both approaches side-by-side, toggleable via VITE_USE_TANSTACK_DB=true environment variable.

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Ready to code?

Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
TanStack DB Integration Plan for Favorites & Compare Features

Overview

Integrate TanStack DB with localStorageCollectionOptions alongside the existing React Context implementation for side-by-side comparison.

Installation

bun add @tanstack/react-db

New File Structure

src/db/
types.ts # Shared types for DB items
collections/
favorites.ts # TanStack DB favorites collection
compare.ts # TanStack DB compare collection
index.ts # Re-exports
hooks/
use-favorites-db.ts # Hook wrapper matching existing API
use-compare-db.ts # Hook wrapper matching existing API
index.ts # Re-exports
index.ts # Main entry point

Data Structure Change

Current (Array of IDs):
favorites: Array<number> // [1, 25, 150]

TanStack DB (Collection of Objects):
interface FavoriteItem {
id: string // UUID for collection key
pokemonId: number // The Pokemon ID
addedAt: Date // Timestamp when added
}

Code Comparison: What Gets Eliminated

| Pattern              | Current Context                     | TanStack DB                  |
| -------------------- | ----------------------------------- | ---------------------------- |
| Hydration management | 15 lines (useState, useEffect)      | 0 lines (automatic)          |
| localStorage sync    | 8 lines (useEffect, JSON.stringify) | 0 lines (built-in)           |
| Provider boilerplate | 15 lines (createContext, Provider)  | 0 lines (singleton)          |
| SSR safety checks    | 5 lines (typeof window)             | 0 lines (handled internally) |
| Total per feature    | ~112 lines                          | ~65 lines (~42% reduction)   |

Performance Improvements

1.  Lookup Performance:

- Current: Array.includes() - O(n)
- TanStack DB: Using Set - O(1)

2.  Re-render Optimization:

- Current: Full component re-render on any state change
- TanStack DB: Fine-grained reactivity via useLiveQuery

3.  Cross-Tab Sync:

- Current: Not implemented
- TanStack DB: Built-in via storage events

4.  Hydration:

- Current: Two-phase (mount + hydrate)
- TanStack DB: Single-phase (automatic)

Implementation Steps

Step 1: Create Types (src/db/types.ts)

export interface FavoriteItem {
id: string
pokemonId: number
addedAt: Date
}

export interface CompareItem {
id: string
pokemonId: number
addedAt: Date
}

Step 2: Create Collections (src/db/collections/)

favorites.ts:
import { createCollection, localStorageCollectionOptions } from '@tanstack/react-db'

export const favoritesCollection = createCollection(
localStorageCollectionOptions({
id: 'pokedex-favorites-db',
storageKey: 'pokedex-favorites-db',
getKey: (item) => item.id,
})
)

compare.ts:
import { createCollection, localStorageCollectionOptions } from '@tanstack/react-db'

export const compareCollection = createCollection(
localStorageCollectionOptions({
id: 'pokedex-compare-db',
storageKey: 'pokedex-compare-db',
getKey: (item) => item.id,
})
)

Step 3: Create Hooks (src/db/hooks/)

Hooks will use useLiveQuery for reactive data and maintain the same API signature:

- useFavoritesDb() returns same interface as useFavorites()
- useCompareDb() returns same interface as useCompare()

Step 4: Add Feature Flag (src/lib/constants.ts)

export const USE_TANSTACK_DB = import.meta.env.VITE_USE_TANSTACK_DB === 'true'

Step 5: Create Unified Exports with Feature Flag

// src/hooks/use-favorites.ts
import { USE_TANSTACK_DB } from '@/lib/constants'
import { useFavorites as useFavoritesContext } from '@/contexts/favorites-context'
import { useFavoritesDb } from '@/db/hooks/use-favorites-db'

export const useFavorites = USE_TANSTACK_DB ? useFavoritesDb : useFavoritesContext

// src/hooks/use-compare.ts
import { USE_TANSTACK_DB } from '@/lib/constants'
import { useCompare as useCompareContext } from '@/contexts/compare-context'
import { useCompareDb } from '@/db/hooks/use-compare-db'

export const useCompare = USE_TANSTACK_DB ? useCompareDb : useCompareContext

Step 6: Update Consumer Imports

Update the 5 consumer files to import from unified hooks:
// Before
import { useFavorites } from '@/contexts/favorites-context'
import { useCompare } from '@/contexts/compare-context'

// After
import { useFavorites } from '@/hooks/use-favorites'
import { useCompare } from '@/hooks/use-compare'

Usage

# Use old Context implementation (default)

bun dev

# Use new TanStack DB implementation

VITE_USE_TANSTACK_DB=true bun dev

Files to Create

| File                             | Purpose                        |
| -------------------------------- | ------------------------------ |
| src/db/types.ts                  | Type definitions               |
| src/db/collections/favorites.ts  | Favorites collection           |
| src/db/collections/compare.ts    | Compare collection             |
| src/db/collections/index.ts      | Re-exports                     |
| src/db/hooks/use-favorites-db.ts | Favorites hook (~65 lines)     |
| src/db/hooks/use-compare-db.ts   | Compare hook (~75 lines)       |
| src/db/hooks/index.ts            | Re-exports                     |
| src/db/index.ts                  | Main entry                     |
| src/hooks/use-favorites.ts       | Unified hook with feature flag |
| src/hooks/use-compare.ts         | Unified hook with feature flag |

Files to Keep (No Modification)

| File                               | Reason              |
| ---------------------------------- | ------------------- |
| src/contexts/favorites-context.tsx | Keep for comparison |
| src/contexts/compare-context.tsx   | Keep for comparison |

Files to Modify

| File                                    | Change                              |
| --------------------------------------- | ----------------------------------- |
| src/lib/constants.ts                    | Add USE_TANSTACK_DB feature flag    |
| src/components/pokemon/pokemon-grid.tsx | Update imports to use unified hooks |
| src/components/layout/header.tsx        | Update imports to use unified hooks |
| src/routes/favorites.tsx                | Update imports to use unified hooks |
| src/routes/compare.tsx                  | Update imports to use unified hooks |
| src/routes/pokemon/$pokemonId.tsx       | Update imports to use unified hooks |

Summary: Key Benefits of TanStack DB

1.  ~42% less code per feature
2.  No Provider required - collections are singletons
3.  Automatic localStorage persistence - no manual sync
4.  SSR safe - handles server/client boundary
5.  Cross-tab sync - built-in via storage events
6.  O(1) lookups - using Set internally
7.  Fine-grained reactivity - via useLiveQuery
