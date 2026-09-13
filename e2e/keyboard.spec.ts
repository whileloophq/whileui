import { expect, test } from '@playwright/test';
import { openCategory, openShowcase } from './showcase';

/**
 * React Native Web only attaches key handling to elements that carry a real role. A
 * `Pressable` without `accessibilityRole` renders as `<div tabindex="0">`: Tab reaches
 * it, Enter and Space do nothing. Before 2026-09-12 that described 185 elements across
 * the showcase, including its own navigation.
 *
 * This is the regression test for that. It is deliberately about activation, not
 * appearance — a control the keyboard cannot operate is broken however it looks.
 */
test.describe('keyboard operation', () => {
  test('every focusable element in the chrome declares a role', async ({ page }) => {
    await openShowcase(page);

    const roleless = await page.evaluate(
      () =>
        [...document.querySelectorAll('[tabindex="0"]')].filter((e) => !e.getAttribute('role'))
          .length
    );

    expect(roleless).toBe(0);
  });

  test('Enter activates a category without a pointer', async ({ page }) => {
    await openShowcase(page);

    await page.getByRole('button', { name: 'Overlays' }).focus();
    await page.keyboard.press('Enter');

    await expect(page.getByRole('button', { name: 'Sheet + native confirm' })).toBeVisible();
  });

  test('Tab reaches the categories in the order they render', async ({ page }) => {
    await openShowcase(page);
    await page.evaluate(() => document.body.focus());

    const reached: string[] = [];
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab');
      reached.push(
        await page.evaluate(() => {
          const el = document.activeElement;
          // The chrome buttons are icon-only; their name lives in `aria-label`. Elsewhere
          // the icon font contributes a private-use glyph to `textContent` that looks
          // like whitespace and is not.
          return (el?.getAttribute('aria-label') ?? el?.textContent ?? '')
            .replace(/[\uE000-\uF8FF]/g, '')
            .trim();
        })
      );
    }

    // Focus order follows document order: the header chrome, then the categories.
    expect(reached).toEqual(['Open menu', 'Change theme', 'All Components', 'Controls']);
  });
});

/**
 * WCAG 2.4.7 (Focus Visible, AA): every keyboard-reachable control needs a visible
 * indicator. Several components removed the browser default with `outline-none` and
 * replaced it with nothing, so tabbing through them showed no focus at all — and axe
 * cannot detect that, which is why this is a hand-written assertion.
 *
 * Exclusions are narrow and deliberate: a visually hidden input (OTPInput's real field
 * sits at `opacity: 0` behind the cells it drives, which carry the blinking cursor), and
 * `<noscript>`, which is not a control.
 */
test('every keyboard-reachable control shows a focus indicator', async ({ page }) => {
  await openShowcase(page);
  await openCategory(page, 'Controls');
  await page.evaluate(() => document.body.focus());

  const missing: string[] = [];

  for (let i = 0; i < 28; i++) {
    await page.keyboard.press('Tab');

    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      // Tab wraps past the last control back to `body`, which is not a control.
      if (!el || el === document.body || el === document.documentElement) return null;

      const style = getComputedStyle(el);
      if (parseFloat(style.opacity) === 0) return null;

      const hasRing = /0px 0px 0px [1-9]\d*px/.test(style.boxShadow);
      const hasOutline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;

      return {
        indicated: hasRing || hasOutline,
        name: (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 30),
      };
    });

    if (stop && !stop.indicated) missing.push(stop.name);
  }

  expect(missing, `no focus indicator on:\n  ${missing.join('\n  ')}`).toEqual([]);
});
