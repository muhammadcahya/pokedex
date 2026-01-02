import { expect, test } from '@playwright/test'

test.describe('Pokemon Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('detail page loads correctly', async ({ page }) => {
    await page.goto('/pokemon/25') // Pikachu

    // Check Pokemon name
    await expect(page.locator('h1')).toContainText('Pikachu')

    // Check Pokemon ID
    await expect(page.locator('text=#025')).toBeVisible()

    // Check types are visible
    const types = page.locator('[data-testid="pokemon-type"]')
    await expect(types).toHaveCount(1) // Pikachu is Electric type

    // Check stats section
    await expect(page.locator('[data-testid="pokemon-stats"]')).toBeVisible()
  })

  test('previous button works', async ({ page }) => {
    await page.goto('/pokemon/25')

    // Click Previous button
    await page.click('button[aria-label*="Previous"]')

    // Should navigate to Pokemon #24
    await expect(page).toHaveURL('/pokemon/24')
  })

  test('next button works', async ({ page }) => {
    await page.goto('/pokemon/25')

    // Click Next button
    await page.click('button[aria-label*="Next"]')

    // Should navigate to Pokemon #26
    await expect(page).toHaveURL('/pokemon/26')
  })

  test('previous disabled on first Pokemon', async ({ page }) => {
    await page.goto('/pokemon/1')

    // Previous button should be disabled
    await expect(page.locator('button[aria-label*="Previous"]')).toBeDisabled()
  })

  test('next disabled on last Pokemon', async ({ page }) => {
    await page.goto('/pokemon/1025')

    // Next button should be disabled
    await expect(page.locator('button[aria-label*="Next"]')).toBeDisabled()
  })

  test('favorite toggle works', async ({ page }) => {
    await page.goto('/pokemon/25')

    // Click favorite button
    await page.click('button[aria-label*="favorite"]')

    // Check localStorage
    const favorites = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('pokedex-favorites') || '[]'),
    )
    expect(favorites).toContain(25)
  })

  test('compare toggle works', async ({ page }) => {
    await page.goto('/pokemon/25')

    // Click compare button
    await page.click('button[aria-label*="compare"]')

    // Check localStorage
    const compare = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('pokedex-compare') || '[]'),
    )
    expect(compare).toContain(25)
  })

  test('breadcrumb navigation works', async ({ page }) => {
    await page.goto('/pokemon/25')

    // Click Home in breadcrumb
    await page.click('a:has-text("Home")')

    // Should navigate to home
    await expect(page).toHaveURL('/')
  })

  test('invalid Pokemon ID shows not found', async ({ page }) => {
    await page.goto('/pokemon/9999')

    // Should show error or not found message
    // Note: Adjust this selector based on actual error page implementation
    const isNotFound =
      (await page.locator('text=/Not Found|404/i').count()) > 0 ||
      (await page.locator('text=/Error/i').count()) > 0

    expect(isNotFound).toBe(true)
  })

  test('navigate between Pokemon preserves state', async ({ page }) => {
    await page.goto('/pokemon/25')

    // Add to favorites
    await page.click('button[aria-label*="favorite"]')

    // Navigate to next Pokemon
    await page.click('button[aria-label*="Next"]')

    // Navigate back
    await page.click('button[aria-label*="Previous"]')

    // Favorite should still be there
    const favorites = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('pokedex-favorites') || '[]'),
    )
    expect(favorites).toContain(25)
  })
})
