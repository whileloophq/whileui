import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../../lib/cn';

// DOM Header, same shape as the native block. DOM-only: `sticky` (default on),
// `children` under the title row, `contentClassName`. Clears the notch itself.

export interface HeaderAction {
  key: string;
  icon: ReactNode;
  /** Accessible name — icon-only buttons need one. */
  label: string;
  onPress: () => void;
  tone?: HeaderIconButtonProps['tone'];
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  leftAction?: ReactNode;
  rightActions?: HeaderAction[];
  centerContent?: ReactNode;
  transparent?: boolean;
  border?: boolean;
  sticky?: boolean;
  /** Classes for the inner column — gutters, max width. */
  contentClassName?: string;
}

export function Header({
  title,
  subtitle,
  leftAction,
  rightActions,
  centerContent,
  transparent = false,
  border = true,
  sticky = true,
  contentClassName,
  className,
  children,
  ...props
}: HeaderProps) {
  const titleBlock =
    title || subtitle ? (
      <div className="min-w-0 flex-1">
        {title && <p className="truncate text-2xl font-bold text-foreground">{title}</p>}
        {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    ) : null;

  return (
    <header
      className={cn(
        sticky && 'sticky top-0 z-30',
        !transparent && 'bg-background/90 backdrop-blur',
        border && 'border-b border-border',
        className
      )}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
      {...props}
    >
      <div className={contentClassName}>
        <div
          className="flex items-center gap-3"
          style={{
            paddingInline: 'calc(var(--ui-control-padding-x-default) * 1px)',
            paddingBlock: 'calc(var(--ui-control-padding-y-default) * 1px)',
          }}
        >
          {leftAction}
          {centerContent ?? titleBlock}
          {rightActions?.length ? (
            <div className="ml-auto flex items-center gap-2">
              {rightActions.map((action) => (
                <HeaderIconButton
                  key={action.key}
                  label={action.label}
                  tone={action.tone}
                  onClick={action.onPress}
                >
                  {action.icon}
                </HeaderIconButton>
              ))}
            </div>
          ) : null}
        </div>
        {children}
      </div>
    </header>
  );
}

Header.displayName = 'Header';

// ─── Icon buttons ────────────────────────────────────────────

export interface HeaderIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name. */
  label: string;
  tone?: 'muted' | 'secondary' | 'ghost';
}

/** 40px square. Children is a complete icon element, sized to 20px. */
export function HeaderIconButton({
  label,
  tone = 'muted',
  className,
  children,
  ...props
}: HeaderIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-xl text-foreground transition-opacity active:opacity-70 [&>svg]:size-5',
        tone === 'muted' && 'bg-muted',
        tone === 'secondary' && 'bg-secondary',
        tone === 'ghost' && 'bg-transparent hover:bg-muted',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

HeaderIconButton.displayName = 'HeaderIconButton';

export interface HeaderBackButtonProps extends Omit<HeaderIconButtonProps, 'label' | 'children'> {
  label?: string;
  icon?: ReactNode;
}

/** Defaults to `history.back()`, matching the Android key and the iOS swipe. */
export function HeaderBackButton({
  label = 'Back',
  icon,
  onClick,
  ...props
}: HeaderBackButtonProps) {
  return (
    <HeaderIconButton
      label={label}
      tone="ghost"
      onClick={onClick ?? (() => window.history.back())}
      {...props}
    >
      {icon ?? (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      )}
    </HeaderIconButton>
  );
}

HeaderBackButton.displayName = 'HeaderBackButton';
