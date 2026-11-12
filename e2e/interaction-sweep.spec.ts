import { expect, test, type Page } from '@playwright/test';
import { CATEGORIES, openCategory, openShowcase, waitForAnimations } from './showcase';

/**
 * Every interactive element on every catalog screen, checked for what a person needs to
 * use it: a role (or Enter does nothing on web), a name, no interactive ancestor (a
 * control inside a control is two to a screen reader), a 24px target (WCAG 2.5.8 AA) and
 * a visible focus indicator (WCAG 2.4.7 AA).
 *
 * Per-component tests checked one screen at a time, and a ring that never showed on the
 * Forms screen went unnoticed because the focus walk only visited Controls. This visits
 * them all and lists every miss at once.
 */
const INTERACTIVE = [
  'button',
  'a[href]',
  'input:not([type=hidden])',
  'textarea',
  '[tabindex="0"]',
  ...[
    'button',
    'checkbox',
    'switch',
    'radio',
    'tab',
    'combobox',
    'link',
    'menuitem',
    'option',
    'slider',
  ].map((role) => `[role="${role}"]`),
].join(',');

/**
 * Runs in the page. Lists what each visible control lacks, inside the last element
 * matching `scope` when one is given (an open overlay), in the whole document otherwise.
 */
function audit({ selector, scope }: { selector: string; scope?: string }) {
  const roots = scope ? Array.from(document.querySelectorAll(scope)) : [];
  const root: ParentNode = roots.at(-1) ?? document;
  const visible = (el: Element) => {
    const box = el.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return false;
    for (let node: Element | null = el; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      if (parseFloat(style.opacity) === 0) return false;
      if (node.getAttribute('aria-hidden') === 'true') return false;
    }
    return true;
  };
  const nameOf = (el: Element) => {
    const label = el.getAttribute('aria-label');
    if (label?.trim()) return label.trim();
    const by = el.getAttribute('aria-labelledby');
    if (by) {
      const text = by
        .split(' ')
        .map((id) => document.getElementById(id)?.textContent ?? '')
        .join(' ')
        .trim();
      if (text) return text;
    }
    const text = (el as HTMLElement).innerText?.trim();
    if (text) return text;
    return (el.getAttribute('placeholder') ?? el.getAttribute('title') ?? '').trim();
  };
  // A composite's container takes Tab and hands focus to its active item (a roving tab
  // stop), so it is focusable without being a control of its own.
  const composite = (el: Element | null) =>
    !!el &&
    ['radiogroup', 'tablist', 'group', 'toolbar', 'menu', 'menubar', 'listbox'].includes(
      el.getAttribute('role') ?? ''
    );
  const out: string[] = [];
  const controls = Array.from(root.querySelectorAll(selector))
    .filter(visible)
    .filter((el) => !composite(el));
  for (const el of controls) {
    const role = el.getAttribute('role') ?? el.tagName.toLowerCase();
    const name = nameOf(el);
    const where = `${role} "${name.slice(0, 40)}"`;
    if (el.getAttribute('tabindex') === '0' && !el.getAttribute('role') && el.tagName === 'DIV') {
      out.push(`${where}: focusable with no role, so Enter and Space do nothing`);
    }
    if (!name) out.push(`${role}: no accessible name`);
    let parent = el.parentElement?.closest(selector) ?? null;
    while (parent && composite(parent)) parent = parent.parentElement?.closest(selector) ?? null;
    if (parent && visible(parent)) {
      out.push(
        `${where}: inside another control (${parent.getAttribute('role') ?? parent.tagName.toLowerCase()})`
      );
    }
    const box = el.getBoundingClientRect();
    const isField = ['input', 'textarea'].includes(el.tagName.toLowerCase());
    if (!isField && (box.width < 24 || box.height < 24)) {
      out.push(`${where}: target ${Math.round(box.width)}×${Math.round(box.height)}px, under 24px`);
    }
  }
  // A radio group or tab list is one Tab stop; the arrow keys move inside it.
  for (const group of Array.from(root.querySelectorAll('[role="radiogroup"], [role="tablist"]'))) {
    if (!visible(group)) continue;
    const stops = [group, ...Array.from(group.querySelectorAll('*'))].filter(
      (el) => (el as HTMLElement).tabIndex >= 0
    ).length;
    if (stops !== 1) {
      out.push(
        `${group.getAttribute('role')} "${nameOf(group).slice(0, 40)}": ${stops} Tab stops, not 1`
      );
    }
  }
  return out;
}

/** Tabs through whatever has focus scope and lists stops with no visible indicator. */
async function focusWalk(page: Page) {
  const missing: string[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      if (parseFloat(style.opacity) === 0) return null;
      const field = ['INPUT', 'TEXTAREA'].includes(el.tagName);
      const ring = /0px 0px 0px [1-9]\d*px/.test(style.boxShadow);
      const outline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
      const box = el.getBoundingClientRect();
      return {
        key: `${el.tagName}:${Math.round(box.x)}:${Math.round(box.y + window.scrollY)}`,
        // Text fields show focus on their own border (`focusField`), not a ring.
        indicated: field || ring || outline,
        name: (el.getAttribute('aria-label') || (el as HTMLElement).innerText || el.tagName)
          .trim()
          .slice(0, 40),
      };
    });
    if (!stop) continue;
    if (seen.has(stop.key)) break;
    seen.add(stop.key);
    if (!stop.indicated) missing.push(`"${stop.name}": no focus indicator`);
  }
  return missing;
}

test.describe.configure({ mode: 'parallel' });

for (const category of CATEGORIES) {
  test(`${category}: every control has a role, a name, a target and a focus ring`, async ({
    page,
  }) => {
    await openShowcase(page);
    await openCategory(page, category);

    const findings = await page.evaluate(audit, { selector: INTERACTIVE });
    // Focus indicators need real keyboard focus: `:focus-visible` follows the keyboard.
    await page.evaluate(() => document.body.focus());
    const all = [...findings, ...(await focusWalk(page))];
    expect(all, `${category}:\n  ${all.join('\n  ')}`).toEqual([]);
  });
}

/**
 * Every overlay in the catalog, opened and swept the same way. The screen sweep never
 * opened one, and menus, dialogs and sheets went without focus rings for releases.
 */
const OVERLAYS: { category: string; trigger: string; open?: 'Enter'; root?: string }[] = [
  { category: 'Overlays', trigger: 'Dialog' },
  { category: 'Overlays', trigger: 'Delete' },
  { category: 'Overlays', trigger: 'Sheet + native confirm' },
  { category: 'Overlays', trigger: 'Nested overlays' },
  { category: 'Overlays', trigger: 'Menu' },
  { category: 'Overlays', trigger: 'Long press for context menu', open: 'Enter' },
  // On web a Select is a Radix listbox in a portal, not a modal window.
  { category: 'Controls', trigger: 'Select a framework', root: '[role="listbox"]' },
  { category: 'Navigation', trigger: 'Open menu' },
];

for (const overlay of OVERLAYS) {
  test(`${overlay.category} › ${overlay.trigger}: the open overlay passes the same sweep`, async ({
    page,
  }) => {
    await openShowcase(page);
    await openCategory(page, overlay.category);
    const trigger = page.getByRole('button', { name: overlay.trigger, exact: true }).first();
    if (overlay.open) {
      await trigger.focus();
      await page.keyboard.press(overlay.open);
    } else {
      await trigger.click();
    }
    const root = overlay.root ?? '[aria-modal="true"]';
    await expect(page.locator(root).last()).toBeVisible();
    await waitForAnimations(page);

    const findings = await page.evaluate(audit, { selector: INTERACTIVE, scope: root });
    const all = [...findings, ...(await focusWalk(page))];
    expect(all, `${overlay.trigger}:\n  ${all.join('\n  ')}`).toEqual([]);
  });
}
