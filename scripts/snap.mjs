/**
 * Lets an agent check a screen without a person looking at it: opens a running showcase
 * app in headless Chromium, optionally clicks through to a screen, then writes a PNG and
 * prints the accessibility tree and any console errors.
 *
 *   bun run snap -- --url http://localhost:8082 --click Controls --theme dark
 *   bun run snap -- --url http://localhost:8084 --click Glazes --out glazes.png
 *
 * Start the app first (`cd apps/showcase/<app> && bun run dev`). --click repeats and
 * matches a button, tab or link by its accessible name, falling back to visible text.
 */
import { chromium } from '@playwright/test';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    url: { type: 'string', default: 'http://localhost:8082' },
    click: { type: 'string', multiple: true, default: [] },
    theme: { type: 'string', default: 'light' },
    width: { type: 'string', default: '390' },
    height: { type: 'string', default: '844' },
    out: { type: 'string', default: 'snap.png' },
  },
});

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(values.width), height: Number(values.height) },
  colorScheme: values.theme === 'dark' ? 'dark' : 'light',
});
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));

try {
  await page.goto(values.url, { waitUntil: 'networkidle' });
  // A React Native Web app paints after its JS boots; wait for the first focusable control.
  await page.locator('[role="button"], [role="tab"], button').first().waitFor();
  for (const name of values.click) {
    const byRole = page
      .getByRole('button', { name, exact: true })
      .or(page.getByRole('tab', { name, exact: true }))
      .or(page.getByRole('link', { name, exact: true }));
    const target = (await byRole.count()) > 0 ? byRole.first() : page.getByText(name).first();
    await target.click();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: values.out });
  console.log(`screenshot: ${values.out}\n`);
  console.log(await page.locator('body').ariaSnapshot());
  console.log(errors.length ? `\nconsole errors:\n${errors.join('\n')}` : '\nconsole errors: none');
} finally {
  await browser.close();
}
