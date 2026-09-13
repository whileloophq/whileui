import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { CATEGORIES, openCategory, openShowcase } from './showcase';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * A ratchet, not a pass/fail line. The first scan found 13 violations across the catalog;
 * the library defects behind most of them are fixed and six categories are already clean.
 * What is left is demo markup and one third-party primitive — real, but not this layer's
 * to fix in one pass.
 *
 * These numbers may only ever go down. Lower one when you fix something; never raise one.
 * A category at 0 must stay at 0.
 */
const ALLOWED: Record<string, number> = {
  'All Components': 0,
  Controls: 1, // aria-allowed-attr — @rn-primitives/select's trigger
  Overlays: 0,
  Forms: 4, // a slider with no name, aria-level on a non-heading, two unlabelled inputs
  Auth: 0,
  Navigation: 1, // color-contrast on destructive-foreground
  Layout: 0,
  Profile: 0,
  Lists: 0,
  Commerce: 1, // image-alt — demo product images
};

test.describe('accessibility scan', () => {
  for (const category of CATEGORIES) {
    test(category, async ({ page }) => {
      await openShowcase(page);
      await openCategory(page, category);

      const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();

      // Name them in the failure message; a bare count tells you nothing at 3am.
      const summary = violations.map((v) => `${v.id}(${v.nodes.length}) ${v.help}`).join('\n  ');
      expect(violations.length, `axe violations:\n  ${summary}`).toBeLessThanOrEqual(
        ALLOWED[category]
      );
    });
  }
});
