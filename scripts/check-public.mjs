/**
 * This repo is public. Fails if anything about to be published names a private detail:
 * a local path, a secret, the committer's email, or a consuming product (read from the
 * gitignored CONSUMERS.md, so the names themselves never enter the repo).
 *
 * Checks every tracked and untracked-but-not-ignored file, this file included, and the
 * messages of commits on this branch that are not on origin/main.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const BASE_RULES = [
  { name: 'local path', pattern: /\/Users\/[a-z]|\/private\/(?:var|tmp)\/|\/home\/[a-z]|C:\\Users\\/i },
  { name: 'API key', pattern: /\bsk-[A-Za-z0-9_-]{20,}/ },
  { name: 'GitHub token', pattern: /\bgh[pousr]_[A-Za-z0-9]{30,}/ },
  { name: 'AWS key', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'private key', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
];

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Rules for this checkout: the base rules, the committer's email, each consuming app. */
export function buildRules({ email, consumers }) {
  const rules = [...BASE_RULES];
  if (email) rules.push({ name: "committer's email", pattern: new RegExp(escape(email), 'i') });
  // First column of the "Consuming applications" table; a name like "my-app" also matches
  // "my app" and "myapp".
  const section = (consumers ?? '').split('## Consuming applications')[1]?.split(/^## /m)[0] ?? '';
  for (const [, name] of section.matchAll(/^\|\s*([A-Za-z][\w-]+)\s*\|/gm)) {
    if (name === 'App') continue;
    const loose = name.split(/[-_]/).map(escape).join('[-_ ]?');
    rules.push({ name: `consumer "${name}"`, pattern: new RegExp(`\\b${loose}\\b`, 'i') });
  }
  return rules;
}

/** Every line of `text` that matches a rule, as "where:line  rule". */
export function scan(where, text, rules) {
  const findings = [];
  text.split('\n').forEach((line, index) => {
    for (const rule of rules) {
      if (rule.pattern.test(line)) findings.push(`${where}:${index + 1}  ${rule.name}`);
    }
  });
  return findings;
}

function main() {
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: 'pipe' });
  const tryGit = (...args) => {
    try {
      return git(...args).trim();
    } catch {
      return '';
    }
  };

  // An unset email and a clone without origin/main are both normal; check what exists.
  const consumers = existsSync('CONSUMERS.md') ? readFileSync('CONSUMERS.md', 'utf8') : '';
  if (!consumers) console.log('note: no CONSUMERS.md here, so product names are not checked');
  const rules = buildRules({ email: tryGit('config', 'user.email'), consumers });

  const findings = [];
  const files = git('ls-files', '-z', '--cached', '--others', '--exclude-standard')
    .split('\0')
    .filter((file) => file && existsSync(file));
  for (const file of files) {
    const buffer = readFileSync(file);
    if (!buffer.includes(0)) findings.push(...scan(file, buffer.toString('utf8'), rules));
  }

  const base = tryGit('merge-base', 'HEAD', 'origin/main');
  const commits = base ? git('rev-list', `${base}..HEAD`).split('\n').filter(Boolean) : [];
  for (const sha of commits) {
    findings.push(...scan(`commit ${sha.slice(0, 7)}`, git('log', '-1', '--format=%B', sha), rules));
  }

  if (findings.length > 0) {
    console.error(`Private details in public files:\n${findings.join('\n')}`);
    process.exit(1);
  }
  console.log(`public check: ${files.length} files and ${commits.length} commits clean`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
