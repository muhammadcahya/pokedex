import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import { DefaultNotFound } from './components/default-not-found'
import { DefaultCatchBoundary } from './components/default-catch-boundary'
import type { ParsedLocation } from '@tanstack/react-router'

// Create query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
})

// Router context type
export interface RouterContext {
  queryClient: QueryClient
}

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadDelay: 100,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: DefaultNotFound,
    context: {
      queryClient,
    },
    // Enable view transitions with directional detection
    defaultViewTransition: ((opts: {
      fromLocation?: ParsedLocation
      toLocation: ParsedLocation
    }) => {
      // Detect Pokemon detail navigation direction
      const fromMatch = opts.fromLocation?.pathname.match(/\/pokemon\/(\d+)/)
      const toMatch = opts.toLocation.pathname.match(/\/pokemon\/(\d+)/)

      if (fromMatch && toMatch) {
        const fromId = parseInt(fromMatch[1])
        const toId = parseInt(toMatch[1])

        if (toId > fromId) {
          return { types: ['forward'] }
        } else if (toId < fromId) {
          return { types: ['backward'] }
        }
      }

      return true // Default transitions for other navigations
    }) as any,
  })

  return router
}

// Type declaration for router
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
