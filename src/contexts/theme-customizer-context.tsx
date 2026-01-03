import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { ThemeConfig } from '@/lib/theme-customizer/types'
import { DEFAULT_THEME_CONFIG } from '@/lib/theme-customizer/types'

interface ThemeCustomizerContextValue {
  config: ThemeConfig
  setTheme: (theme: ThemeConfig['theme']) => void
  setSurface: (surface: ThemeConfig['surface']) => void
  setRadius: (radius: ThemeConfig['radius']) => void
  setConfig: (config: Partial<ThemeConfig>) => void
  resetConfig: () => void
}

const ThemeCustomizerContext =
  createContext<ThemeCustomizerContextValue | null>(null)

const STORAGE_KEY = 'pokedex-theme-config'

function getStoredConfig(): ThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_THEME_CONFIG
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored
      ? { ...DEFAULT_THEME_CONFIG, ...JSON.parse(stored) }
      : DEFAULT_THEME_CONFIG
  } catch {
    return DEFAULT_THEME_CONFIG
  }
}

export function ThemeCustomizerProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setConfigState(getStoredConfig())
    setIsHydrated(true)
  }, [])

  // Apply theme to documentElement and persist to localStorage
  useEffect(() => {
    if (!isHydrated) return

    const root = document.documentElement

    // Update data-theme attribute
    root.setAttribute('data-theme', config.theme)

    // Update data-surface attribute
    root.setAttribute('data-surface', config.surface)

    // Update --radius CSS variable
    root.style.setProperty('--radius', `${config.radius}rem`)

    // Persist to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  }, [config, isHydrated])

  const setTheme = useCallback((theme: ThemeConfig['theme']) => {
    setConfigState((prev) => ({ ...prev, theme }))
  }, [])

  const setSurface = useCallback((surface: ThemeConfig['surface']) => {
    setConfigState((prev) => ({ ...prev, surface }))
  }, [])

  const setRadius = useCallback((radius: ThemeConfig['radius']) => {
    setConfigState((prev) => ({ ...prev, radius }))
  }, [])

  const setConfig = useCallback((partial: Partial<ThemeConfig>) => {
    setConfigState((prev) => ({ ...prev, ...partial }))
  }, [])

  const resetConfig = useCallback(() => {
    setConfigState(DEFAULT_THEME_CONFIG)
  }, [])

  return (
    <ThemeCustomizerContext.Provider
      value={{
        config,
        setTheme,
        setSurface,
        setRadius,
        setConfig,
        resetConfig,
      }}
    >
      {children}
    </ThemeCustomizerContext.Provider>
  )
}

export function useThemeCustomizer(): ThemeCustomizerContextValue {
  const context = useContext(ThemeCustomizerContext)
  if (!context) {
    throw new Error(
      'useThemeCustomizer must be used within ThemeCustomizerProvider',
    )
  }
  return context
}
