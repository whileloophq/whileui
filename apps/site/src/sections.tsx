import type { ReactNode } from 'react';

// Section helpers, same names and props as `apps/showcase/App.tsx`.

export function SectionGroup({ label }: { label: string }) {
  return (
    <div className="mt-6 mb-4">
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

// What a category is still waiting on. Visible on purpose: the showcase is the
// port's progress board.
export function Pending({ items }: { items: string[] }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-6">
      <p className="text-sm font-medium text-foreground">Not ported yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        These exist on the native track and are waiting for a screen to pull them across.
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Single-path stroke icon so the showcase needs no icon dependency. Sized by
// its container. The real icon-dependency decision is not made here.
export function Glyph({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}
