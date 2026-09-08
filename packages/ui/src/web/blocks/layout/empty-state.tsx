import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../../lib/cn';
import { Button, ButtonText } from '../../components/button';
import { surfacePadding, typographyRecipe } from '../../lib/recipes';

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
}

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

function DefaultEmptyIcon() {
  return (
    <div className="mb-6 flex size-14 items-center justify-center rounded-lg border-2 border-dashed border-muted">
      <div className="h-4 w-5 rounded-sm border border-muted-foreground" />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  style,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center', className)}
      style={{ ...surfacePadding('lg'), ...style }}
      {...props}
    >
      <div className="mb-6">
        {icon ? <div className="text-muted-foreground">{icon}</div> : <DefaultEmptyIcon />}
      </div>

      <p
        className="mb-2 text-center font-semibold text-foreground"
        style={typographyRecipe('title')}
      >
        {title}
      </p>

      {description && (
        <p className="mb-6 max-w-xs text-center text-sm text-muted-foreground">{description}</p>
      )}

      {action && (
        <Button className="mb-3" onClick={action.onPress}>
          <ButtonText>{action.label}</ButtonText>
        </Button>
      )}

      {secondaryAction && (
        <Button variant="ghost" onClick={secondaryAction.onPress}>
          <ButtonText>{secondaryAction.label}</ButtonText>
        </Button>
      )}
    </div>
  );
}

EmptyState.displayName = 'EmptyState';
