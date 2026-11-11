/**
 * This repo is public. Fails if anything about to be published names a private detail:
 * a local path, a secret, the committer's email, or a consuming product (read from the
 * gitignored CONSUMERS.md, so the names themselves never enter the repo).
 *
 * Checks every tracked and untracked-but-not-ignored file, and the messages of commits
 * on this branch that are not on main.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
const SELF = 'scripts/check-public.mjs';

const rules = [
  { name: 'local path', pattern: /\/Users\/[a-z]|\/private\/(?:var|tmp)\/|\/home\/[a-z]|C:\\Users\\/i },
  { name: 'API key', pattern: /\bsk-[A-Za-z0-9_-]{20,}/ },
  { name: 'GitHub token', pattern: /\bgh[pousr]_[A-Za-z0-9]{30,}/ },
  { name: 'AWS key', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'private key', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
];

const email = git('config', 'user.email').trim();
if (email) rules.push({ name: "committer's email", pattern: new RegExp(escape(email), 'i') });

// First column of the "Consuming applications" table; a name like "my-app" also matches
// "my app" and "myapp".
if (existsSync('CONSUMERS.md')) {
  const after = readFileSync('CONSUMERS.md', 'utf8').split('## Consuming applications')[1] ?? '';
  const table = after.split(/^## /m)[0];
  for (const [, name] of table.matchAll(/^\|\s*([A-Za-z][\w-]+)\s*\|/gm)) {
    if (name === 'App') continue;
    const loose = name.split(/[-_]/).map(escape).join('[-_ ]?');
    rules.push({ name: `consumer "${name}"`, pattern: new RegExp(`\\b${loose}\\b`, 'i') });
  }
} else {
  console.log('note: no CONSUMERS.md here, so product names are not checked');
}

function escape(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const findings = [];
const scan = (where, text) => {
  text.split('\n').forEach((line, index) => {
    for (const rule of rules) {
      if (rule.pattern.test(line)) findings.push(`${where}:${index + 1}  ${rule.name}`);
    }
  });
};

const files = git('ls-files', '-z', '--cached', '--others', '--exclude-standard')
  .split('\0')
  .filter((file) => file && file !== SELF && existsSync(file));
for (const file of files) {
  const buffer = readFileSync(file);
  if (buffer.includes(0)) continue; // binary
  scan(file, buffer.toString('utf8'));
}

const branchOnly = git('rev-list', 'HEAD', '^main').split('\n').filter(Boolean);
for (const sha of branchOnly) scan(`commit ${sha.slice(0, 7)}`, git('log', '-1', '--format=%B', sha));

if (findings.length > 0) {
  console.error(`Private details in public files:\n${findings.join('\n')}`);
  process.exit(1);
}
console.log(`public check: ${files.length} files and ${branchOnly.length} commits clean`);
