import type { PokemonTypeName } from '@/types/pokemon'

export interface TypeColorConfig {
  bg: string
  text: string
  border: string
}

export const TYPE_COLORS: Record<PokemonTypeName, TypeColorConfig> = {
  normal: {
    bg: 'oklch(0.75 0.03 90)',
    text: 'oklch(0.25 0 0)',
    border: 'oklch(0.65 0.04 90)',
  },
  fire: {
    bg: 'oklch(0.65 0.18 35)',
    text: 'oklch(1 0 0)',
    border: 'oklch(0.55 0.20 35)',
  },
  water: {
    bg: 'oklch(0.60 0.15 250)',
    text: 'oklch(1 0 0)',
    border: 'oklch(0.50 0.17 250)',
  },
  electric: {
    bg: 'oklch(0.85 0.18 95)',
    text: 'oklch(0.25 0 0)',
    border: 'oklch(0.75 0.20 95)',
  },
  grass: {
    bg: 'oklch(0.65 0.18 145)',
    text: 'oklch(1 0 0)',
    border: 'oklch(0.55 0.20 145)',
  },
  ice: {
    bg: 'oklch(0.80 0.10 200)',
    text: 'oklch(0.25 0 0)',
    border: 'oklch(0.70 0.12 200)',
  },
  fighting: {
    bg: 'oklch(0.55 0.18 25)',
    text: 'oklch(1 0 0)',
    border: 'oklch(0.45 0.20 25)',
  },
  poison: {
    bg: 'oklch(0.55 0.18 320)',
    text: 'oklch(1 0 0)',
    border: 'oklch(0.45 0.20 320)',
  },
  ground: {
    bg: 'oklch(0.70 0.12 70)',
    text: 'oklch(0.25 0 0)',
    border: 'oklch(0.60 0.14 70)',
  },
  flying: {
    bg: 'oklch(0.75 0.10 280)',
    text: 'oklch(0.25 0 0)',
    border: 'oklch(0.65 0.12 280)',
  },
  psychic: {
    bg: 'oklch(0.65 0.18 350)',
    text: 'oklch(1 0 0)',
    border: 'oklch(0.55 0.20 350)',
  },
  bug: {
    bg: 'oklch(0.70 0.16 120)',
    text: 'oklch(0.25 0 0)',
    border: 'oklch(0.60 0.18 120)',
  },
  rock: {
    bg: 'oklch(0.60 0.08 80)',
    text: 'oklch(1 0 0)',
    border: 'oklch(0.50 0.10 80)',
  },
  ghost: {
    bg: 'oklch(0.45 0.12 300)',
    text: 'oklch(1 0 0)',
    border: 'oklch(0.35 0.14 300)',
  },
  dragon: {
    bg: 'oklch(0.50 0.18 280)',
    text: 'oklch(1 0 0)',
    border: 'oklch(0.40 0.20 280)',
  },
  dark: {
    bg: 'oklch(0.40 0.06 60)',
    text: 'oklch(1 0 0)',
    border: 'oklch(0.30 0.08 60)',
  },
  steel: {
    bg: 'oklch(0.72 0.03 250)',
    text: 'oklch(0.25 0 0)',
    border: 'oklch(0.62 0.04 250)',
  },
  fairy: {
    bg: 'oklch(0.78 0.12 350)',
    text: 'oklch(0.25 0 0)',
    border: 'oklch(0.68 0.14 350)',
  },
}

export const ALL_TYPES: Array<PokemonTypeName> = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

export function getTypeColor(type: string): TypeColorConfig {
  const typeName = type as PokemonTypeName
  if (typeName in TYPE_COLORS) {
    return TYPE_COLORS[typeName]
  }
  return TYPE_COLORS.normal
}
