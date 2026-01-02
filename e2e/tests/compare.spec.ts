import { expect, test } from '@playwright/test'

test.describe('Compare', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('add to compare from home', async ({ page }) => {
    await page.goto('/')

    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Click compare button on first Pokemon
    await page
      .locator('[data-testid="pokemon-card"]')
      .first()
      .locator('button[aria-label*="compare"]')
      .click()

    // Check localStorage
    const compare = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('pokedex-compare') || '[]'),
    )
    expect(compare.length).toBe(1)
  })

  test('compare max 4 Pokemon', async ({ page }) => {
    await page.goto('/')

    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Add 4 Pokemon to compare
    for (let i = 0; i < 4; i++) {
      await page
        .locator('[data-testid="pokemon-card"]')
        .nth(i)
        .locator('button[aria-label*="compare"]')
        .click()
      await page.waitForTimeout(200)
    }

    // 5th button should be disabled
    const fifthButton = page
      .locator('[data-testid="pokemon-card"]')
      .nth(4)
      .locator('button[aria-label*="compare"]')

    await expect(fifthButton).toBeDisabled()
  })

  test('compare page shows all Pokemon', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('pokedex-compare', JSON.stringify([1, 4, 7, 25]))
    })

    await page.goto('/compare')

    // Should show 4 Pokemon
    await page.waitForSelector('[data-testid="pokemon-card"]')
    await expect(page.locator('[data-testid="pokemon-card"]')).toHaveCount(4)
  })

  test('remove from compare works', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('pokedex-compare', JSON.stringify([1, 4]))
    })

    await page.goto('/compare')

    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Click remove button on first Pokemon
    await page.locator('button[aria-label*="remove"]').first().click()

    await page.waitForTimeout(500)

    // Should have 1 Pokemon left
    await expect(page.locator('[data-testid="pokemon-card"]')).toHaveCount(1)
  })

  test('clear all compare works', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('pokedex-compare', JSON.stringify([1, 4, 7, 25]))
    })

    await page.goto('/compare')

    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Click Clear All
    await page.click('button:has-text("Clear All")')

    await page.waitForTimeout(500)

    // Should be empty
    const cards = await page.locator('[data-testid="pokemon-card"]').count()
    expect(cards).toBe(0)
  })

  test('empty compare page shows empty state', async ({ page }) => {
    await page.goto('/compare')

    // Should show empty state message
    await expect(page.locator('text=/No.*Pokemon/i')).toBeVisible()
  })

  test('compare persists after reload', async ({ page }) => {
    await page.goto('/')

    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Add to compare
    await page
      .locator('[data-testid="pokemon-card"]')
      .first()
      .locator('button[aria-label*="compare"]')
      .click()

    // Reload
    await page.reload()

    // Check still in compare
    const compare = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('pokedex-compare') || '[]'),
    )
    expect(compare.length).toBe(1)
  })
})
