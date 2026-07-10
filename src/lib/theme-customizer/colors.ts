import type { BrandColor, SurfaceColor } from './types'

// Color metadata for display
interface ColorMetadata {
  name: BrandColor | SurfaceColor
  label: string
  preview: {
    light: string // Tailwind color for light mode preview
    dark: string // Tailwind color for dark mode preview
  }
}

export const BRAND_COLOR_METADATA: Array<ColorMetadata> = [
  {
    name: 'daidan',
    label: 'daidan',
    preview: { light: 'bg-blue-900', dark: 'bg-neutral-100' },
  },
  {
    name: 'mbss',
    label: 'mbss',
    preview: { light: 'bg-blue-900', dark: 'bg-white' },
  },
  {
    name: 'shadcn',
    label: 'shadcn',
    preview: { light: 'bg-neutral-900', dark: 'bg-neutral-100' },
  },
  {
    name: 'black',
    label: 'Black',
    preview: { light: 'bg-black', dark: 'bg-white' },
  },
  {
    name: 'red',
    label: 'Red',
    preview: { light: 'bg-red-600', dark: 'bg-red-500' },
  },
  {
    name: 'orange',
    label: 'Orange',
    preview: { light: 'bg-orange-600', dark: 'bg-orange-500' },
  },
  {
    name: 'amber',
    label: 'Amber',
    preview: { light: 'bg-amber-600', dark: 'bg-amber-500' },
  },
  {
    name: 'yellow',
    label: 'Yellow',
    preview: { light: 'bg-yellow-600', dark: 'bg-yellow-500' },
  },
  {
    name: 'lime',
    label: 'Lime',
    preview: { light: 'bg-lime-600', dark: 'bg-lime-500' },
  },
  {
    name: 'green',
    label: 'Green',
    preview: { light: 'bg-green-600', dark: 'bg-green-500' },
  },
  {
    name: 'emerald',
    label: 'Emerald',
    preview: { light: 'bg-emerald-600', dark: 'bg-emerald-500' },
  },
  {
    name: 'teal',
    label: 'Teal',
    preview: { light: 'bg-teal-600', dark: 'bg-teal-500' },
  },
  {
    name: 'cyan',
    label: 'Cyan',
    preview: { light: 'bg-cyan-600', dark: 'bg-cyan-500' },
  },
  {
    name: 'sky',
    label: 'Sky',
    preview: { light: 'bg-sky-600', dark: 'bg-sky-500' },
  },
  {
    name: 'blue',
    label: 'Blue',
    preview: { light: 'bg-blue-600', dark: 'bg-blue-500' },
  },
  {
    name: 'indigo',
    label: 'Indigo',
    preview: { light: 'bg-indigo-600', dark: 'bg-indigo-500' },
  },
  {
    name: 'violet',
    label: 'Violet',
    preview: { light: 'bg-violet-600', dark: 'bg-violet-500' },
  },
  {
    name: 'purple',
    label: 'Purple',
    preview: { light: 'bg-purple-600', dark: 'bg-purple-500' },
  },
  {
    name: 'fuchsia',
    label: 'Fuchsia',
    preview: { light: 'bg-fuchsia-600', dark: 'bg-fuchsia-500' },
  },
  {
    name: 'pink',
    label: 'Pink',
    preview: { light: 'bg-pink-600', dark: 'bg-pink-500' },
  },
  {
    name: 'rose',
    label: 'Rose',
    preview: { light: 'bg-rose-600', dark: 'bg-rose-500' },
  },
  {
    name: 'slate',
    label: 'Slate',
    preview: { light: 'bg-slate-600', dark: 'bg-slate-500' },
  },
  {
    name: 'gray',
    label: 'Gray',
    preview: { light: 'bg-gray-600', dark: 'bg-gray-500' },
  },
  {
    name: 'zinc',
    label: 'Zinc',
    preview: { light: 'bg-zinc-600', dark: 'bg-zinc-500' },
  },
  {
    name: 'neutral',
    label: 'Neutral',
    preview: { light: 'bg-neutral-600', dark: 'bg-neutral-500' },
  },
  {
    name: 'stone',
    label: 'Stone',
    preview: { light: 'bg-stone-600', dark: 'bg-stone-500' },
  },
]

export const SURFACE_COLOR_METADATA: Array<ColorMetadata> = [
  {
    name: 'slate',
    label: 'Slate',
    preview: { light: 'bg-slate-300', dark: 'bg-slate-700' },
  },
  {
    name: 'gray',
    label: 'Gray',
    preview: { light: 'bg-gray-300', dark: 'bg-gray-700' },
  },
  {
    name: 'zinc',
    label: 'Zinc',
    preview: { light: 'bg-zinc-300', dark: 'bg-zinc-700' },
  },
  {
    name: 'neutral',
    label: 'Neutral',
    preview: { light: 'bg-neutral-300', dark: 'bg-neutral-700' },
  },
  {
    name: 'stone',
    label: 'Stone',
    preview: { light: 'bg-stone-300', dark: 'bg-stone-700' },
  },
]
