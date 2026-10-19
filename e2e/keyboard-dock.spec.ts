import { expect, test } from '@playwright/test';
import { openCategory, openShowcase } from './showcase';

/**
 * Web has no OS keyboard to avoid. This checks the other half of the contract: the
 * docked field is on screen at a phone width and a desktop width, Tab reaches it, and
 * the focus ring is visible. It must not depend on a translated native keyboard offset.
 */
const WIDTHS = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 800 },
];

for (const viewport of WIDTHS) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('the docked field stays in the viewport and shows a focus ring', async ({ page }) => {
      await openShowcase(page);
      await openCategory(page, 'Layout');
      await page.getByRole('button', { name: 'Open keyboard screen' }).click();

      const close = page.getByRole('button', { name: 'Close keyboard screen' });
      await close.waitFor();
      await close.focus();
      await page.keyboard.press('Tab');

      const field = page.getByRole('textbox', { name: 'Message' });
      await expect(field).toBeFocused();
      await page.keyboard.type('hello');
      await expect(field).toHaveValue('hello');

      const box = await field.boundingBox();
      const size = page.viewportSize();
      expect(box, 'message field has no box').not.toBeNull();
      expect(size, 'viewport is missing').not.toBeNull();
      if (!box || !size) return;

      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(size.width + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(size.height + 1);
      // Docked to the bottom edge, not parked at the top of a scrolling page.
      expect(box.y + box.height).toBeGreaterThan(size.height * 0.7);

      const indicated = await field.evaluate((el) => {
        const style = getComputedStyle(el);
        const hasRing = /0px 0px 0px [1-9]\d*px/.test(style.boxShadow);
        const hasOutline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
        return hasRing || hasOutline;
      });
      expect(indicated, 'message field has no focus indicator').toBe(true);
    });
  });
}
