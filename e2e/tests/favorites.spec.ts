import { expect, test } from '@playwright/test'

test.describe('Favorites', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('add favorite from home', async ({ page }) => {
    await page.goto('/')

    // Wait for Pokemon cards
    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Click heart on first Pokemon
    await page
      .locator('[data-testid="pokemon-card"]')
      .first()
      .locator('button[aria-label*="favorite"]')
      .click()

    // Check localStorage
    const favorites = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('pokedex-favorites') || '[]'),
    )
    expect(favorites.length).toBe(1)
  })

  test('favorites persist after reload', async ({ page }) => {
    await page.goto('/')

    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Add favorite
    await page
      .locator('[data-testid="pokemon-card"]')
      .first()
      .locator('button[aria-label*="favorite"]')
      .click()

    // Reload page
    await page.reload()

    // Check still favorited
    const favorites = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('pokedex-favorites') || '[]'),
    )
    expect(favorites.length).toBe(1)
  })

  test('favorites page shows favorited Pokemon', async ({ page }) => {
    // Pre-populate favorite
    await page.evaluate(() => {
      localStorage.setItem('pokedex-favorites', JSON.stringify([25])) // Pikachu
    })

    await page.goto('/favorites')

    // Should show 1 Pokemon
    await page.waitForSelector('[data-testid="pokemon-card"]')
    await expect(page.locator('[data-testid="pokemon-card"]')).toHaveCount(1)
  })

  test('remove favorite works', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('pokedex-favorites', JSON.stringify([25]))
    })

    await page.goto('/favorites')

    // Wait for card to load
    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Click heart to unfavorite
    await page.locator('button[aria-label*="favorite"]').click()

    // Wait a moment for update
    await page.waitForTimeout(500)

    // Should show empty state
    const cards = await page.locator('[data-testid="pokemon-card"]').count()
    expect(cards).toBe(0)
  })

  test('clear all favorites works', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('pokedex-favorites', JSON.stringify([25, 1, 4]))
    })

    await page.goto('/favorites')

    // Wait for cards
    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Click Clear All
    await page.click('button:has-text("Clear All")')

    // Wait for update
    await page.waitForTimeout(500)

    // Should be empty
    const cards = await page.locator('[data-testid="pokemon-card"]').count()
    expect(cards).toBe(0)
  })

  test('empty favorites page shows empty state', async ({ page }) => {
    await page.goto('/favorites')

    // Should show empty state message
    await expect(page.locator('text=/No.*favorites/i')).toBeVisible()
  })
})
