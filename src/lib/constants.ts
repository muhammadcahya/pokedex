// PokeAPI base URL
export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const MAX_POKEMON = 1025

// Compare limit
export const MAX_COMPARE_POKEMON = 4

// LocalStorage keys
export const STORAGE_KEYS = {
  favorites: 'pokedex-favorites',
  compare: 'pokedex-compare',
} as const

// Stat max values for progress bars
export const STAT_MAX_VALUES = {
  hp: 255,
  attack: 190,
  defense: 230,
  'special-attack': 194,
  'special-defense': 230,
  speed: 200,
  total: 720,
} as const

// Cache times for TanStack Query (in milliseconds)
export const CACHE_TIMES = {
  pokemonList: 1000 * 60 * 30, // 30 minutes
  pokemonDetails: 1000 * 60 * 60, // 1 hour
  species: 1000 * 60 * 60, // 1 hour
  evolutionChain: 1000 * 60 * 60 * 24, // 24 hours
  typeDetails: 1000 * 60 * 60 * 24, // 24 hours
  abilities: 1000 * 60 * 60 * 24, // 24 hours
} as const

// Debounce delays
export const DEBOUNCE_DELAYS = {
  search: 300,
} as const

// Feature flags
// Use TanStack DB for favorites/compare instead of React Context
// Set VITE_USE_TANSTACK_DB=true in .env to enable
export const USE_TANSTACK_DB = import.meta.env.VITE_USE_TANSTACK_DB === 'true'
