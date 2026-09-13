import { expect, test } from '@playwright/test';
import { openCategory, openShowcase } from './showcase';

/**
 * `PLAN.md` > Web baseline promises "working layout from 320 px to desktop widths".
 * Nothing asserted it until a horizontal scrollbar turned up in review and there was no
 * way to tell a real overflow from a device-emulation artifact without measuring.
 *
 * A sideways scrollbar on a phone is a layout bug, not a preference. The one thing that
 * *should* scroll horizontally is the category strip, so the check ignores anything
 * inside a clipping ancestor and looks only at content that escapes the page.
 */
const WIDTHS = [320, 390];
const CATEGORIES_UNDER_TEST = ['All Components', 'Controls', 'Layout', 'Lists'];

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const category of CATEGORIES_UNDER_TEST) {
      test(`${category} does not scroll sideways`, async ({ page }) => {
        await openShowcase(page);
        await openCategory(page, category);

        const result = await page.evaluate(() => {
          const escaped: string[] = [];
          for (const el of document.querySelectorAll('*')) {
            const box = el.getBoundingClientRect();
            if (box.width === 0 || box.right <= innerWidth + 1) continue;

            // Anything inside a clipping or scrolling ancestor is contained by design —
            // the category strip is exactly that.
            let parent = el.parentElement;
            let contained = false;
            while (parent) {
              const overflowX = getComputedStyle(parent).overflowX;
              if (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'hidden') {
                contained = true;
                break;
              }
              parent = parent.parentElement;
            }
            if (!contained) {
              escaped.push(
                `${el.tagName} to ${Math.round(box.right)}px: ${el.textContent?.trim().slice(0, 30)}`
              );
            }
          }
          return {
            documentWidth: document.documentElement.scrollWidth,
            viewport: innerWidth,
            escaped,
          };
        });

        expect(
          result.escaped,
          `content escaping the viewport:\n  ${result.escaped.join('\n  ')}`
        ).toEqual([]);
        expect(result.documentWidth).toBeLessThanOrEqual(result.viewport);
      });
    }
  });
}
