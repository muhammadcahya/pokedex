import type { Page } from '@playwright/test'

/**
 * Clear localStorage before each test
 */
export async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear())
}

/**
 * Search for Pokemon with debounce wait
 */
export async function searchPokemon(page: Page, query: string) {
  await page.fill('input[placeholder*="Search"]', query)
  await page.waitForTimeout(600) // Wait for debounce
}

/**
 * Add Pokemon to favorites
 */
export async function addFavorite(page: Page, pokemonId: number) {
  const card = page.locator(`[data-pokemon-id="${pokemonId}"]`).first()
  await card.locator('button[aria-label*="favorite"]').click()
}

/**
 * Get count of active filters
 */
export async function getActiveFilterCount(page: Page): Promise<number> {
  const filters = await page.locator('[data-active-filter]').count()
  return filters
}

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle')
}

/**
 * Navigate to home page
 */
export async function goHome(page: Page) {
  await page.goto('/')
  await waitForPageLoad(page)
}
