import { defineConfig, devices } from '@playwright/test';

/**
 * Browser evidence for the React Native Web target. Runs against the *exported* bundle,
 * not the dev server: web is a production target, and the dev server does not exercise
 * the same Metro output a user would load.
 *
 * WebKit is not optional here. It is the engine on every iOS browser, and it is where
 * focus management and `:focus-visible` behaviour diverge from Chromium.
 */
const PORT = 8083;

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  // No retries. These run on a developer's machine before a push, and a test that only
  // passes on the second attempt is a finding, not a pass.
  retries: 0,
  // Relative to this file otherwise; pinned at the repo root where `.gitignore` is.
  outputDir: '../test-results',
  reporter: 'list',

  use: {
    baseURL: `http://localhost:${PORT}`,
    // Nothing retries, so capture the first failure properly.
    trace: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    // Export first so the run cannot silently pass against a stale `dist/`.
    command: 'bun run build:web && bun run serve:web',
    cwd: '../apps/showcase',
    url: `http://localhost:${PORT}`,
    // Never reuse. The command above exports first precisely so a run cannot pass
    // against a stale bundle — reusing a server someone left running defeats that, and
    // it already produced one false failure against an old `dist`.
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
