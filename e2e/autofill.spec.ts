import { expect, test } from '@playwright/test';
import { openCategory, openShowcase } from './showcase';

test.describe('browser autofill', () => {
  test.beforeEach(async ({ page }) => {
    await openShowcase(page);
    await openCategory(page, 'Auth');
    await expect(page.getByTestId('autofill-password')).toBeVisible();
  });

  test('ships the themed autofill declarations', async ({ page }) => {
    const autofillCss = await page.evaluate(() =>
      [...document.styleSheets]
        .flatMap((sheet) => [...sheet.cssRules])
        .map((rule) => rule.cssText)
        .filter((text) => text.includes('autofill'))
        .join('\n')
    );

    expect(autofillCss).toContain('box-shadow');
    expect(autofillCss).toContain('-webkit-text-fill-color');
    expect(autofillCss).toContain('caret-color');
  });

  test('keeps a dark autofilled password field on theme', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Forcing :autofill requires Chromium DevTools');

    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    });

    const input = page.getByTestId('autofill-password');
    await input.fill('stored-password');

    const session = await page.context().newCDPSession(page);
    await session.send('DOM.enable');
    await session.send('CSS.enable');
    const { root } = await session.send('DOM.getDocument');
    const { nodeId } = await session.send('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: '[data-testid="autofill-password"]',
    });
    await session.send('CSS.forcePseudoState', {
      nodeId,
      forcedPseudoClasses: ['autofill'],
    });

    const styles = await input.evaluate((element) => {
      const probe = document.createElement('div');
      probe.style.color = 'var(--color-foreground)';
      probe.style.boxShadow = 'inset 0 0 0 1000px var(--color-muted)';
      document.body.appendChild(probe);

      const actual = getComputedStyle(element);
      const expected = getComputedStyle(probe);
      const result = {
        caret: actual.caretColor,
        foreground: actual.webkitTextFillColor,
        shadow: actual.boxShadow,
        expectedForeground: expected.color,
        expectedShadow: expected.boxShadow,
      };
      probe.remove();
      return result;
    });

    expect(styles.foreground).toBe(styles.expectedForeground);
    expect(styles.caret).toBe(styles.expectedForeground);
    expect(styles.shadow).toContain(styles.expectedShadow);
  });
});
