import { expect, test } from '@playwright/test'
import { clearStorage } from '../helpers/test-helpers'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearStorage(page)
  })

  test('loads Pokemon grid', async ({ page }) => {
    await page.goto('/')

    // Wait for Pokemon cards to load
    await page.waitForSelector('[data-testid="pokemon-card"]', {
      timeout: 10000,
    })

    // Default 40 Pokemon per page
    const cardCount = await page.locator('[data-testid="pokemon-card"]').count()
    expect(cardCount).toBeGreaterThan(0)
    expect(cardCount).toBeLessThanOrEqual(40)
  })

  test('search filters Pokemon', async ({ page }) => {
    await page.goto('/')

    // Wait for initial load
    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Search for Pikachu
    await page.fill('input[placeholder*="Search"]', 'Pikachu')
    await page.waitForTimeout(600) // Wait for debounce

    const cards = await page.locator('[data-testid="pokemon-card"]').count()
    expect(cards).toBeGreaterThan(0)
    expect(cards).toBeLessThan(40)
  })

  test('pagination works', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Click Next button
    await page.click('button:has-text("Next")')

    // Check URL updated
    await expect(page).toHaveURL(/page=2/)
  })

  test('click Pokemon navigates to detail', async ({ page }) => {
    await page.goto('/')

    // Wait for cards to load
    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Click first Pokemon card
    await page.locator('[data-testid="pokemon-card"]').first().click()

    // Should navigate to detail page
    await expect(page).toHaveURL(/\/pokemon\/\d+/)
  })

  test('sort by name A-Z works', async ({ page }) => {
    await page.goto('/')

    // Wait for page load
    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Select sort option
    await page.selectOption('select[name="sort"]', 'name-asc')

    // Check URL updated
    await expect(page).toHaveURL(/sort=name-asc/)
  })

  test('sort by highest number works', async ({ page }) => {
    await page.goto('/')

    await page.waitForSelector('[data-testid="pokemon-card"]')

    await page.selectOption('select[name="sort"]', 'number-desc')

    await expect(page).toHaveURL(/sort=number-desc/)
  })

  test('filter → detail → back preserves filters', async ({ page }) => {
    await page.goto('/?types=fire')

    await page.waitForSelector('[data-testid="pokemon-card"]')

    // Click first Pokemon
    await page.locator('[data-testid="pokemon-card"]').first().click()

    // Go back
    await page.goBack()

    // Filters should be preserved
    await expect(page).toHaveURL(/types=fire/)
  })

  test('theme toggle works', async ({ page }) => {
    await page.goto('/')

    // Click theme toggle
    await page.click('button[aria-label*="theme"]')
    await page.click('text=Dark')

    // Check localStorage
    const theme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(theme).toBe('dark')
  })
})
