import { expect, test } from '@playwright/test';
import { openShowcase } from './showcase';

test.describe('shared press feedback', () => {
  test.beforeEach(async ({ page }) => {
    await openShowcase(page);
  });

  test('pointer feedback changes opacity without moving the control', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Primary', exact: true }).first();
    const before = await button.boundingBox();

    await button.hover();
    await page.mouse.down();
    await page.waitForTimeout(80);

    const pressedOpacity = await button.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).opacity)
    );
    const during = await button.boundingBox();
    expect(pressedOpacity).toBeLessThan(1);
    expect(during).toEqual(before);

    await page.mouse.up();
    await expect(button).toHaveCSS('opacity', '1');
  });

  test('keyboard activation invokes the same action', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Press test: 0' });
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Press test: 1' })).toBeVisible();
  });

  test('loading is visibly busy and unavailable', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Saving changes' });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
