import { expect, test } from '@playwright/test';
import { openCategory, openShowcase, waitForAnimations } from './showcase';

/**
 * Overlay behaviour the unit layer cannot reach: real focus, a real `Escape` key, and the
 * accessibility tree a browser actually builds. `07-verification.md` lists these as the
 * browser layer's job precisely because Jest renders a React tree, not a document.
 */
test.describe('AlertDialog', () => {
  test.beforeEach(async ({ page }) => {
    await openShowcase(page);
    await openCategory(page, 'Overlays');
  });

  test('opens from its trigger and exposes its contents to the accessibility tree', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Delete', exact: true }).first().click();

    // The title is a heading, and both controls are buttons. Neither was true before
    // 2026-09-12: the title was plain text and the controls carried no role at all.
    await expect(page.getByRole('heading')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
    await expect(page.locator('[role="alert"]')).toHaveCount(1);
  });

  test('closes on Escape and returns focus to its trigger', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Delete', exact: true }).first();
    await trigger.click();
    await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
    // Not padding: React Native Web ignores Escape until the entry animation ends.
    await waitForAnimations(page);

    await page.keyboard.press('Escape');

    await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('leaves nothing hidden from assistive technology behind it', async ({ page }) => {
    await page.getByRole('button', { name: 'Delete', exact: true }).first().click();

    // The backdrop carries `importantForAccessibility="no"`, and in several overlays the
    // backdrop *wraps* the panel. If React Native Web ever maps that to `aria-hidden`,
    // the whole dialog disappears from the accessibility tree and this catches it.
    await expect(page.locator('[aria-hidden="true"]')).toHaveCount(0);
  });
});
