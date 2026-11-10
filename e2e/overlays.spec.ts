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
    // The panel itself is the alert region. `Alert` components elsewhere on the tab
    // carry the same role, so scope to the dialog's own text.
    await expect(page.locator('[role="alert"]', { hasText: 'Delete workspace?' })).toHaveCount(1);
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

/**
 * Overlays nested inside a Sheet. A Select or Popover that portals to the app root lands
 * outside the sheet's `aria-modal` dialog and its focus trap, and one Escape press closed
 * both layers: Radix dismisses on `keydown`, React Native Web's Modal on `keyup`. The host
 * gives nested content a portal target inside the dialog and routes a dismiss request to
 * the topmost nested overlay first. Both tests fail with the host logic disabled.
 */
test.describe('Nested overlays', () => {
  const sheetDescription = 'A Select and a confirmation inside one sheet.';

  test.beforeEach(async ({ page }) => {
    await openShowcase(page);
    await openCategory(page, 'Overlays');
    await page.getByRole('button', { name: 'Nested overlays', exact: true }).click();
    await expect(page.getByText(sheetDescription)).toBeVisible();
    await waitForAnimations(page);
  });

  test('a Select inside a Sheet renders inside the sheet dialog and takes the click', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Choose a region' }).click();
    // React Native Web marks the Modal `aria-modal`, which tells assistive technology to
    // ignore everything outside that dialog. A listbox portaled to the document root is
    // outside it, so the option must be a descendant of the sheet's own dialog.
    const sheet = page.getByRole('dialog').filter({ hasText: sheetDescription });
    await sheet.getByRole('option', { name: 'Europe' }).click();
    await expect(page.getByRole('button', { name: 'Europe' })).toBeVisible();
  });

  test('Escape closes one layer per press and leaves the page operable without the trigger', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Choose a region' }).click();
    await expect(page.getByRole('listbox')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('listbox')).toHaveCount(0);
    // A closing sheet is still visible during its exit animation. Only after animations
    // settle does "still visible" mean "still open".
    await waitForAnimations(page);
    await expect(page.getByRole('dialog').filter({ hasText: sheetDescription })).toHaveCount(1);

    await page.keyboard.press('Escape');
    await expect(page.getByText(sheetDescription)).toHaveCount(0);

    // The trigger unmounted while the sheet was open, so there is no element to return
    // focus to. The next Tab must still land on something visible.
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  });

  test('a confirmation dialog inside the sheet closes before the sheet', async ({ page }) => {
    await page.getByRole('button', { name: 'Remove region', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Remove region?' })).toBeVisible();
    await waitForAnimations(page);

    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: 'Remove region?' })).toHaveCount(0);
    await waitForAnimations(page);
    await expect(page.getByRole('dialog').filter({ hasText: sheetDescription })).toHaveCount(1);

    await page.keyboard.press('Escape');
    await expect(page.getByText(sheetDescription)).toHaveCount(0);
  });
});

test.describe('DrawerMenu', () => {
  test('closes on Escape', async ({ page }) => {
    await openShowcase(page);
    await page.getByRole('button', { name: /Open menu/ }).click();
    const footer = page.getByText('Built with ❤️ for React Native');
    await expect(footer).toBeVisible();
    await waitForAnimations(page);

    await page.keyboard.press('Escape');
    await expect(footer).toHaveCount(0);
  });
});
