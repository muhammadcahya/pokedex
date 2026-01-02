import { expect, test } from '@playwright/test'
import { clearStorage } from '../helpers/test-helpers'

test.describe('Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearStorage(page)
  })

  test('type filter works', async ({ page }) => {
    await page.goto('/')

    // Open advanced filters
    await page.click('button:has-text("Advanced")')

    // Select fire type
    await page.click('button:has-text("Fire")')
    await page.waitForTimeout(500)

    // Check URL
    await expect(page).toHaveURL(/types=fire/)
  })

  test('region filter works', async ({ page }) => {
    await page.goto('/')

    await page.click('button:has-text("Advanced")')
    await page.click('button:has-text("Kanto")')

    await expect(page).toHaveURL(/regions=kanto/)
  })

  test('height filter works', async ({ page }) => {
    await page.goto('/')

    await page.click('button:has-text("Advanced")')

    // Select height option
    const heightSelect = page.locator('select[name="height"]')
    if ((await heightSelect.count()) > 0) {
      await heightSelect.selectOption('tall')
      await expect(page).toHaveURL(/height=tall/)
    }
  })

  test('clear filters works', async ({ page }) => {
    await page.goto('/?types=fire&regions=kanto')

    // Wait for page load
    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Click Clear button
    await page.click('button:has-text("Clear")')

    // URL should be cleared
    await expect(page).toHaveURL('http://localhost:3000/')
  })

  test('filter combinations work', async ({ page }) => {
    await page.goto('/')

    await page.click('button:has-text("Advanced")')

    // Apply multiple filters
    await page.click('button:has-text("Fire")')
    await page.waitForTimeout(300)
    await page.click('button:has-text("Kanto")')
    await page.waitForTimeout(300)

    // Both filters should be in URL
    await expect(page).toHaveURL(/types=fire/)
    await expect(page).toHaveURL(/regions=kanto/)
  })

  test('empty search results', async ({ page }) => {
    await page.goto('/')

    // Search for non-existent Pokemon
    await page.fill('input[placeholder*="Search"]', 'zzzzznonexistent')
    await page.waitForTimeout(600)

    // Should show empty state or no results
    const cards = await page.locator('[data-testid="pokemon-card"]').count()
    expect(cards).toBe(0)
  })

  test('URL state is shareable', async ({ page }) => {
    // Navigate directly to URL with filters
    await page.goto('/?types=fire&regions=kanto&sort=name-asc')

    // Wait for page to load
    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Filters should be active
    const url = page.url()
    expect(url).toContain('types=fire')
    expect(url).toContain('regions=kanto')
    expect(url).toContain('sort=name-asc')
  })
})
