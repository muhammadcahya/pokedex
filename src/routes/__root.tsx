import { QueryClientProvider } from '@tanstack/react-query'
import {
  HeadContent,
  Outlet,
  ScriptOnce,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

import type { RouterContext } from '@/router'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { FavoritesProvider } from '@/contexts/favorites-context'
import { CompareProvider } from '@/contexts/compare-context'
import { ThemeCustomizerProvider } from '@/contexts/theme-customizer-context'

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Pokedex',
      },
      {
        name: 'description',
        content: 'Explore and discover all Pokemon from every generation',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/pokeball-logo.svg',
        type: 'image/svg+xml',
      },
    ],
  }),

  component: RootComponent,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()

  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          <CompareProvider>
            <Outlet />
          </CompareProvider>
        </FavoritesProvider>
      </QueryClientProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <ThemeCustomizerProvider>
            <ScriptOnce>
              {`(() => {
                try {
                  const stored = localStorage.getItem('pokedex-theme-config');
                  const config = stored ? JSON.parse(stored) : { theme: 'blue', surface: 'zinc', radius: 0.5 };
                  document.documentElement.setAttribute('data-theme', config.theme);
                  document.documentElement.setAttribute('data-surface', config.surface);
                  document.documentElement.style.setProperty('--radius', config.radius + 'rem');
                } catch {}
              })()`}
            </ScriptOnce>
            <TooltipProvider>
              {children}
              <Toaster richColors />
            </TooltipProvider>
          </ThemeCustomizerProvider>
        </ThemeProvider>
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'TanStack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
