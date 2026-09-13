import type { Page } from '@playwright/test';

/** Every category in the showcase's sidebar, in the order it renders them. */
export const CATEGORIES = [
  'All Components',
  'Controls',
  'Overlays',
  'Forms',
  'Auth',
  'Navigation',
  'Layout',
  'Profile',
  'Lists',
  'Commerce',
] as const;

/**
 * The showcase is a React Native Web bundle: the served HTML is an empty shell and the
 * first paint happens after the JS boots. Waiting for a known control is the only
 * reliable signal that the app is interactive.
 */
export async function openShowcase(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Primary', exact: true }).first().waitFor();
}

export async function openCategory(page: Page, category: string) {
  await page.getByText(category, { exact: true }).first().click();
  // Category switching swaps the whole content tree; give it a commit before asserting.
  await page.waitForTimeout(400);
}

/**
 * React Native Web arms a modal's `Escape` handler from the `onShow` callback, which fires
 * when the entry animation *ends*. Until then the key is ignored. Waiting for animations
 * to settle is therefore part of the contract, not test flake padding — see the note in
 * `docs/stability.md` > Browser evidence.
 */
export async function waitForAnimations(page: Page) {
  await page.waitForFunction(
    () =>
      document
        .getAnimations()
        // Skeleton shimmer and pulse loop forever; they are never "settled".
        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
        .every((a) => a.playState !== 'running'),
    undefined,
    { timeout: 5_000 }
  );
}
