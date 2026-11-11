import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { buildRules, scan } from './check-public.mjs';

const consumers = `# Consumers
## Consuming applications
| App     | Repo   |
| ------- | ------ |
| demo-app | ../x  |
## Current stack
| Auth | not a consumer |
`;
const rules = buildRules({ email: 'person@example.com', consumers });
// Built at runtime so this file does not trip the check it tests.
const leak = { path: ['', 'Users', 'someone', 'app'].join('/'), key: `sk-${'a'.repeat(24)}` };
const findings = (text) => scan('f', text, rules).map((f) => f.split('  ')[1]);

test('flags each kind of private detail', () => {
  assert.deepEqual(findings(`see ${leak.path}`), ['local path']);
  assert.deepEqual(findings(`key ${leak.key}`), ['API key']);
  assert.deepEqual(findings('mail Person@Example.com'), ["committer's email"]);
  assert.deepEqual(findings('built for Demo App'), ['consumer "demo-app"']);
  assert.deepEqual(findings('built for demoapp'), ['consumer "demo-app"']);
});

test('reads consumers from their own section only', () => {
  assert.deepEqual(findings('the Auth templates'), []);
});

test('works with no email and no consumer list', () => {
  assert.deepEqual(scan('f', 'plain text', buildRules({ email: '', consumers: '' })), []);
});

test('its own source does not trip its rules', () => {
  const self = readFileSync(new URL('./check-public.mjs', import.meta.url), 'utf8');
  assert.deepEqual(scan('self', self, buildRules({ email: '', consumers: '' })), []);
});
