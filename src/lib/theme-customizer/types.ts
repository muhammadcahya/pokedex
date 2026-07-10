// Brand color options (colors from styles.css)
export const BRAND_COLORS = [
  'mbss',
  'daidan',
  'shadcn',
  'black',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
] as const

export type BrandColor = (typeof BRAND_COLORS)[number]

// Surface color options (5 colors from styles.css)
export const SURFACE_COLORS = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
] as const

export type SurfaceColor = (typeof SURFACE_COLORS)[number]

// Radius options (matching shadcn patterns)
export const RADIUS_OPTIONS = [0, 0.125, 0.25, 0.375, 0.5] as const

export type RadiusOption = (typeof RADIUS_OPTIONS)[number]

// Complete theme configuration
export interface ThemeConfig {
  theme: BrandColor // Primary/brand color
  surface: SurfaceColor // Neutral/surface color
  radius: RadiusOption // Border radius in rem
}

// Default configuration (matching current __root.tsx)
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  theme: 'blue',
  surface: 'zinc',
  radius: 0.5, // Closest to current 0.65rem
}
