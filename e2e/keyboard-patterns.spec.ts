import { expect, test, type Locator, type Page } from '@playwright/test';
import { openCategory, openShowcase } from './showcase';

/**
 * The WAI-ARIA Authoring Practices keyboard pattern for each stateful control, checked
 * in the browser. A composite widget — a radio group, a tab list, a toggle group — is
 * one Tab stop, and the arrow keys move inside it; a checkbox, switch or toggle answers
 * Space. Unit tests cannot see any of this: it is the browser's focus and key handling.
 */

const focusedName = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return (el?.getAttribute('aria-label') || el?.innerText || '').trim();
  });

/**
 * How many Tab stops a composite has, counting the container and everything in it: one,
 * for a roving tab stop. Radix makes the container the stop until an item has been
 * focused, then hands it to the selected item, so counting items alone reads zero.
 */
async function tabStops(composite: Locator) {
  return composite.evaluate(
    (root) =>
      [root, ...Array.from(root.querySelectorAll('*'))].filter(
        (el) => (el as HTMLElement).tabIndex >= 0
      ).length
  );
}

/**
 * Press an arrow key the way a person does. Radix moves focus on a timer after keydown
 * and selects the newly focused radio only while the key is still down; Playwright's
 * `press` releases at once, so in Chromium the keyup landed first and nothing selected.
 */
async function arrow(page: Page, key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') {
  await page.keyboard.down(key);
  await page.waitForTimeout(50);
  await page.keyboard.up(key);
}

test.describe('keyboard patterns', () => {
  test('radio group: one Tab stop, arrows move and select', async ({ page }) => {
    await openShowcase(page);
    await openCategory(page, 'Controls');
    const group = page.getByRole('radiogroup').filter({ hasText: 'Centimeters' });

    expect(await tabStops(group)).toBe(1);

    await group.getByRole('radio', { name: 'Centimeters' }).focus();
    await arrow(page, 'ArrowRight');
    expect(await focusedName(page)).toBe('Inches');
    await expect(group.getByRole('radio', { name: 'Inches' })).toBeChecked();

    await arrow(page, 'ArrowLeft');
    await expect(group.getByRole('radio', { name: 'Centimeters' })).toBeChecked();
  });

  test('toggle group: one Tab stop, arrows move', async ({ page }) => {
    await openShowcase(page);
    await openCategory(page, 'Controls');
    const group = page
      .getByRole('radiogroup')
      .filter({ has: page.getByRole('radio', { name: 'L', exact: true }) });
    const items = group.getByRole('radio');

    expect(await tabStops(group)).toBe(1);

    await items.first().focus();
    await arrow(page, 'ArrowRight');
    expect(await focusedName(page)).toBe('C');
  });

  test('radio group with labels: one group, one Tab stop, arrows select', async ({ page }) => {
    await openShowcase(page);
    await openCategory(page, 'Controls');
    const free = page.getByRole('radio', { name: 'Free plan' });
    const group = page.getByRole('radiogroup').filter({ has: free });
    await expect(group).toHaveCount(1);
    await expect(free).toHaveText(/Free plan/);
    expect(await tabStops(group)).toBe(1);

    await free.focus();
    await arrow(page, 'ArrowDown');
    expect(await focusedName(page)).toMatch(/^Pro plan/);
    await expect(page.getByRole('radio', { name: /Pro plan/ })).toBeChecked();
  });

  test('tabs: one Tab stop, arrows move, the panel is labelled', async ({ page }) => {
    await openShowcase(page);
    await openCategory(page, 'Overlays');
    const list = page.getByRole('tablist').filter({ hasText: 'Preview' });

    expect(await tabStops(list)).toBe(1);

    await list.getByRole('tab', { name: 'Preview' }).focus();
    await arrow(page, 'ArrowRight');
    expect(await focusedName(page)).toBe('Code');
    await expect(list.getByRole('tab', { name: 'Code' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toHaveCount(1);
  });

  test('accordion: headers expose expanded state and toggle from the keyboard', async ({
    page,
  }) => {
    await openShowcase(page);
    await openCategory(page, 'Overlays');
    const header = page.getByRole('button', { name: 'Can I customize the theme?' });

    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await header.focus();
    await page.keyboard.press('Enter');
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Space');
    await expect(header).toHaveAttribute('aria-expanded', 'false');
  });

  test('collapsible: the trigger exposes expanded state', async ({ page }) => {
    await openShowcase(page);
    await openCategory(page, 'Overlays');
    const trigger = page.getByRole('button', { name: 'Show' });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: /Hide|Show/ }).first()).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  test('toggle: Space and Enter flip the pressed state', async ({ page }) => {
    await openShowcase(page);
    await openCategory(page, 'Controls');
    const bold = page.getByRole('button', { name: 'Bold' });

    await expect(bold).toHaveAttribute('aria-pressed', 'false');
    await bold.focus();
    await page.keyboard.press('Space');
    await expect(bold).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Enter');
    await expect(bold).toHaveAttribute('aria-pressed', 'false');
  });

  test('checkbox and switch: Space flips the checked state', async ({ page }) => {
    await openShowcase(page);
    await openCategory(page, 'Forms');
    const checkbox = page.getByRole('checkbox', { name: /Terms & Privacy/ });
    const toggle = page.getByRole('switch', { name: 'Notify me' });

    const before = await checkbox.getAttribute('aria-checked');
    await checkbox.focus();
    await page.keyboard.press('Space');
    await expect(checkbox).not.toHaveAttribute('aria-checked', before ?? '');

    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await toggle.focus();
    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  });
});
