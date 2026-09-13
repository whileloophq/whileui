import { expect, test } from '@playwright/test';
import { CATEGORIES, openCategory, openShowcase } from './showcase';

/**
 * A component can throw during render and leave the rest of the page looking fine. The
 * `Select` did exactly that for an unknown length of time: every style array it passed
 * was spread into `{ 0: …, 1: … }` by the web primitive's Slot, the numeric keys hit the
 * DOM as indexed style properties, and it threw. The component rendered nothing at all.
 *
 * Thirty-two browser tests passed throughout, because none of them touched a Select and
 * the axe ratchet only asserts an upper bound — a component that vanishes reports fewer
 * violations, not more.
 *
 * So: no uncaught error on any screen, and the one component that was broken has to
 * actually be there.
 */
test.describe('runtime integrity', () => {
  for (const category of CATEGORIES) {
    test(`${category} renders without an uncaught error`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));

      await openShowcase(page);
      await openCategory(page, category);

      expect(errors, `uncaught errors on ${category}:\n  ${errors.join('\n  ')}`).toEqual([]);
    });
  }

  test('Select renders as a real control, not a collapsed box', async ({ page }) => {
    await openShowcase(page);
    await openCategory(page, 'Controls');

    const trigger = page.getByRole('button', { name: /Select a framework/ }).first();
    await expect(trigger).toBeVisible();

    // It collapsed to 24px with no padding when its styles were being dropped. The
    // platform minimum for a touch control is 44.
    const box = await trigger.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  });
});

/**
 * The Select had no interaction coverage at all, which is how it stayed broken on web
 * while 32 browser tests passed. Opening it and choosing something is the cheapest
 * assertion that would have caught both the render failure and a see-through panel.
 */
test.describe('Select', () => {
  test.beforeEach(async ({ page }) => {
    await openShowcase(page);
    await openCategory(page, 'Controls');
  });

  test('opens, offers options and takes a choice', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /Select a framework/ }).first();
    await trigger.click();

    await expect(page.getByRole('option').first()).toBeVisible();

    await page
      .getByRole('option', { name: /Flutter/ })
      .first()
      .click();

    await expect(page.getByRole('option')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Flutter/ }).first()).toBeVisible();
  });

  test('its panel is opaque, not see-through', async ({ page }) => {
    await page
      .getByRole('button', { name: /Select a framework/ })
      .first()
      .click();
    await expect(page.getByRole('option').first()).toBeVisible();

    // `--color-popover` once carried alpha, so page content read straight through an
    // open dropdown. A floating surface has to be opaque; glass belongs to the
    // explicitly frosted variants, which supply a blur behind themselves.
    const alpha = await page
      .getByRole('listbox')
      .first()
      .evaluate((el) => {
        let node: Element | null = el;
        while (node) {
          const bg = getComputedStyle(node).backgroundColor;
          if (bg !== 'rgba(0, 0, 0, 0)') {
            const match = /rgba?\([^)]*?(?:,\s*([\d.]+))?\)$/.exec(bg);
            return match?.[1] ? parseFloat(match[1]) : 1;
          }
          node = node.parentElement;
        }
        return 1;
      });

    expect(alpha).toBe(1);
  });
});

/**
 * axe cannot check contrast on this app — it reports "background color could not be
 * determined due to a background image" for most of the page, because the showcase
 * paints a backdrop. So the one case that actually failed gets a direct assertion.
 *
 * The Select placeholder rendered in the user-agent default black on a dark surface:
 * measured at 1.2:1, unreadable. Neither `className` nor `style` reached it, because the
 * web build of the primitive's `Value` wraps a Radix span in a `Slot.Text` that drops
 * React Native props. We render the text ourselves now.
 */
test('Select placeholder meets AA contrast', async ({ page }) => {
  await openShowcase(page);
  await openCategory(page, 'Controls');

  const ratio = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const resolve = (css: string): number[] => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3] / 255];
    };
    const over = (fg: number[], bg: number[]) =>
      [0, 1, 2].map((i) => Math.round(fg[i] * fg[3] + bg[i] * (1 - fg[3]))).concat(1);
    const luminance = (c: number[]) => {
      const ch = (v: number) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2]);
    };

    const el = [...document.querySelectorAll('*')].find(
      (e) => e.textContent?.trim() === 'Select a framework' && e.children.length === 0
    );
    if (!el) return 0;

    // Composite the translucent surface stack down to an opaque colour.
    const stack: number[][] = [];
    let node: Element | null = el.parentElement;
    while (node) {
      const c = resolve(getComputedStyle(node).backgroundColor);
      if (c[3] > 0) stack.push(c);
      node = node.parentElement;
    }
    let bg = stack.length ? stack[stack.length - 1] : [0, 0, 0, 1];
    for (let i = stack.length - 2; i >= 0; i--) bg = over(stack[i], bg);

    const fg = over(resolve(getComputedStyle(el).color), bg);
    const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
    return (hi + 0.05) / (lo + 0.05);
  });

  expect(ratio).toBeGreaterThanOrEqual(4.5);
});
