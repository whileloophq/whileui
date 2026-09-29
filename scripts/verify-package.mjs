/**
 * Checks the package we would actually publish, not the workspace.
 *
 * The workspace lies in ways that only surface after `npm publish`. Bun hoists every
 * dependency to the root, so an import we never declared resolves here and fails for a
 * consumer. `packages/ui` is a symlink, so `files` is never enforced. And nothing in the
 * repo proves Tailwind can find our class names once `src` is gone.
 *
 * So: pack a real tarball, extract it somewhere with no `node_modules` above it, and ask
 * four questions of the result.
 */
import { execFileSync } from 'node:child_process';
import {
  closeSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKG = join(ROOT, 'packages/ui');

// `maxBuffer` is explicit because the default truncates stdout at 64 kB, and attw's
// JSON report crosses that as soon as the export map grows. A truncated report parsed
// as JSON throws a SyntaxError that reads like a tooling bug rather than a size limit.
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, {
    encoding: 'utf8',
    stdio: 'pipe',
    maxBuffer: 64 * 1024 * 1024,
    ...opts,
  });

let failures = 0;
const pass = (msg) => console.log(`  ok    ${msg}`);
const fail = (msg, detail) => {
  failures++;
  console.log(`  FAIL  ${msg}`);
  if (detail) console.log(String(detail).replace(/^/gm, '        '));
};
const step = (msg) => console.log(`\n${msg}`);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

// ---------------------------------------------------------------------------

step('Packing');
run('npm', ['run', 'build'], { cwd: ROOT });
const packed = JSON.parse(
  run('npm', ['pack', '--json', '--pack-destination', tmpdir()], { cwd: PKG })
);
const tarball = join(tmpdir(), packed[0].filename);
console.log(
  `  ${packed[0].filename} — ${packed[0].files.length} files, ${(packed[0].size / 1024) | 0} kB`
);

const work = mkdtempSync(join(tmpdir(), 'whileui-pkg-'));
run('tar', ['-xzf', tarball, '-C', work]);
const installed = join(work, 'package');
const manifest = JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8'));

try {
  // -------------------------------------------------------------------------
  step('Every entry in the export map exists in the tarball');

  for (const [subpath, entry] of Object.entries(manifest.exports)) {
    const targets = typeof entry === 'string' ? [entry] : Object.values(entry);
    for (const target of targets) {
      // Wildcards need a concrete example; take the first real directory.
      const resolved = target.includes('*')
        ? target.replace('*', subpath.includes('components') ? 'button' : 'layout')
        : target;
      if (existsSync(join(installed, resolved))) pass(`${subpath} → ${resolved}`);
      else fail(`${subpath} → ${resolved} is missing from the package`);
    }
  }

  // -------------------------------------------------------------------------
  step('Every bare import is a declared dependency or peer');

  const declared = new Set([
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.peerDependencies ?? {}),
  ]);
  const files = (await walk(join(installed, 'dist'))).filter((f) => f.endsWith('.js'));
  const undeclared = new Map();

  for (const file of files) {
    // Strip comments first. Several files document their own usage in JSDoc
    // (`import { PortalHost } from '@thewhileloop/whileui'`), and a scanner that counts
    // those reports the package as depending on itself.
    const source = readFileSync(file, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');

    const specifiers = [
      ...source.matchAll(/\b(?:from|import)\s*\(?\s*["']([^"']+)["']/g),
      ...source.matchAll(/\brequire\s*\(\s*["']([^"']+)["']/g),
    ];

    for (const match of specifiers) {
      const spec = match[1];
      if (spec.startsWith('.') || spec.startsWith('node:')) continue;
      // `pkg/sub/path` is still the `pkg` dependency; `@scope/pkg/sub` keeps two segments.
      const parts = spec.split('/');
      const name = spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
      if (!declared.has(name)) {
        if (!undeclared.has(name)) undeclared.set(name, relative(installed, file));
      }
    }
  }

  if (undeclared.size === 0) pass(`${files.length} files import nothing undeclared`);
  else
    for (const [name, where] of undeclared)
      fail(`"${name}" is imported but not declared`, `first seen in ${where}`);

  // -------------------------------------------------------------------------
  step('Tailwind finds our class names with no src/ to scan');

  // The monorepo points `@source` at `packages/ui/src`. A consumer has only `dist`, so
  // this is the first time that path is exercised. If it fails, every consumer gets
  // structurally correct, completely unstyled components.
  // `@import "tailwindcss"` resolves relative to the CSS file, so the file has to live
  // somewhere `tailwindcss` is installed. `@source` is absolute and points at the
  // extracted tarball — that is the part actually under test.
  const cssDir = join(ROOT, 'node_modules', '.verify-package');
  mkdirSync(cssDir, { recursive: true });
  const cssIn = join(cssDir, 'in.css');
  const cssOut = join(cssDir, 'out.css');
  // The semantic utilities only exist if the consumer defines the tokens behind them,
  // so declare a couple the way a real app's `global.css` would. `rounded-full` needs
  // nothing and proves the scan itself reached `dist`.
  writeFileSync(
    cssIn,
    [
      // `source(none)` disables automatic detection. Without it Tailwind walks up from the
      // CSS file and scans this repo, so the check passes even when the tarball is empty —
      // which is exactly what happened the first time.
      '@import "tailwindcss" source(none);',
      `@source "${installed}/dist";`,
      '@theme {',
      '  --color-primary: oklch(0.5 0 0);',
      '  --color-muted-foreground: oklch(0.6 0 0);',
      '}',
      '',
    ].join('\n')
  );
  try {
    run('bunx', ['@tailwindcss/cli', '-i', cssIn, '-o', cssOut], { cwd: ROOT });
    const css = readFileSync(cssOut, 'utf8');
    // Classes that appear in our components and nowhere in this fixture's own CSS.
    const expected = ['bg-primary', 'text-muted-foreground', 'rounded-full'];
    const missing = expected.filter((c) => !css.includes(`.${c}`));
    if (missing.length === 0) pass(`generated utilities for ${expected.join(', ')}`);
    else fail(`Tailwind did not generate: ${missing.join(', ')}`, 'dist is not scannable');
  } catch (error) {
    fail('Tailwind CLI failed', error.stderr || error.message);
  }

  // -------------------------------------------------------------------------
  step('publint');
  try {
    const out = run('bunx', ['publint', '--strict'], { cwd: PKG });
    if (/Suggestions|Warnings|Errors/.test(out)) fail('publint had something to say', out);
    else pass('clean');
  } catch (error) {
    fail('publint reported problems', error.stdout || error.message);
  }

  // -------------------------------------------------------------------------
  step('Types resolve the way the JavaScript does');
  {
    // attw exits non-zero whenever it finds anything, including things we accept, so
    // read its JSON and decide for ourselves. Write stdout straight to disk: the stdout
    // attached to a non-zero child result was still cut at 64 kB with a larger
    // maxBuffer, which turned a valid report into invalid JSON.
    const reportPath = join(work, 'attw.json');
    const reportFd = openSync(reportPath, 'w');
    try {
      run('bunx', ['@arethetypeswrong/cli', '--pack', '.', '-f', 'json'], {
        cwd: PKG,
        stdio: ['ignore', reportFd, 'pipe'],
      });
    } catch {
      // A non-zero exit is expected when the report contains accepted non-bundler
      // findings. The JSON on disk decides whether the package passes.
    } finally {
      closeSync(reportFd);
    }
    const raw = readFileSync(reportPath, 'utf8');
    // `bunx` prints its own install chatter before the tool's output the first time it
    // resolves a package, so the stream is not pure JSON.
    const start = raw?.indexOf('{') ?? -1;
    let problems = null;
    if (start >= 0) {
      try {
        problems = Object.values(JSON.parse(raw.slice(start)).problems ?? {}).flat();
      } catch (error) {
        // Say which failure this is. A truncated or non-JSON report is a problem with
        // this script, not with the package being checked.
        fail('attw report could not be parsed', `${error.message}\n${raw.slice(-400)}`);
        problems = [];
      }
    }

    if (problems === null) {
      fail('attw produced no report', raw);
    } else {
      // `bundler` is the only resolution our consumers use: Metro and Vite both. The
      // others are reported, not gated —
      //   node16   the emitted `.d.ts` use extensionless relative imports, which that
      //            mode rejects. Fixing it means `.js` suffixes throughout source.
      //   node16-cjs / node10  we are ESM-only and target modern toolchains.
      const gated = problems.filter(
        (p) => p.resolutionKind === 'bundler' || p.resolutionOption === 'bundler'
      );

      const summary = Object.entries(
        problems.reduce((acc, p) => {
          const mode = p.resolutionKind ?? p.resolutionOption ?? '?';
          acc[`${p.kind} (${mode})`] = (acc[`${p.kind} (${mode})`] ?? 0) + 1;
          return acc;
        }, {})
      )
        .map(([k, n]) => `${k} ×${n}`)
        .join(', ');

      if (gated.length === 0) pass(`bundler resolution is clean — known elsewhere: ${summary}`);
      else fail(`${gated.length} problem(s) in bundler resolution`, summary);
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
  rmSync(join(ROOT, 'node_modules', '.verify-package'), { recursive: true, force: true });
  rmSync(tarball, { force: true });
}

console.log('');
if (failures > 0) {
  console.log(`${failures} problem${failures === 1 ? '' : 's'} with the published package.`);
  process.exit(1);
}
console.log('Package is publishable.');
