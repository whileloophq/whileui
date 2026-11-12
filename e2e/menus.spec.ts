import { expect, test } from '@playwright/test';
import { openCategory, openShowcase, waitForAnimations } from './showcase';

/**
 * The WAI-ARIA menu pattern, which none of the three menus followed: opening from the
 * keyboard puts focus on the first item, the arrow keys move between items, choosing one
 * runs it and closes the menu, and Escape returns focus to the trigger.
 */
test.describe('menus', () => {
  test.beforeEach(async ({ page }) => {
    await openShowcase(page);
    await openCategory(page, 'Overlays');
  });

  test('dropdown: keyboard opens it on the first item, arrows move, Enter chooses and closes', async ({
    page,
  }) => {
    const trigger = page.getByRole('button', { name: 'Menu', exact: true });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.focus();
    await page.keyboard.press('Enter');

    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await waitForAnimations(page);
    await expect(menu.getByRole('menuitem', { name: 'Settings' })).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(menu.getByRole('menuitem', { name: 'Members' })).toBeFocused();
    await page.keyboard.press('End');
    await expect(menu.getByRole('menuitem', { name: 'API Keys' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(menu.getByRole('menuitem', { name: 'Settings' })).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(page.getByText('Settings', { exact: true }).last()).toBeVisible();
  });

  test('dropdown: Escape closes it and returns focus to the trigger', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Menu', exact: true });
    await trigger.click();
    await expect(page.getByRole('menu')).toBeVisible();
    await waitForAnimations(page);

    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('context menu opens from the keyboard and from a right-click', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Long press for context menu' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('menu')).toBeVisible();
    await waitForAnimations(page);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toHaveCount(0);

    await trigger.click({ button: 'right' });
    await expect(page.getByRole('menu').getByRole('menuitem', { name: 'Copy' })).toBeVisible();
  });
});
