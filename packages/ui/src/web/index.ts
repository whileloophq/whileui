// WhileUI DOM track. Lives beside the native track until the 2.0 split moves it
// to the package root. Anything host-specific belongs in `platform/`.

export * from './components/alert';
export * from './components/alert-dialog';
export * from './components/badge';
export * from './components/button';
export * from './components/card';
export * from './components/error-boundary';
export * from './components/input';
export * from './components/numeric-input';
export * from './components/otp-input';
export * from './components/progress';
export * from './components/segmented-control';
export * from './components/separator';
export * from './components/skeleton';
export * from './components/spinner';
export * from './components/switch';
export * from './components/textarea';
export * from './lib/theme-provider';

export * from './blocks/auth/google-button';
export * from './blocks/layout/app-shell';
export * from './blocks/layout/empty-state';
export * from './blocks/layout/sheet';
export * from './blocks/layout/page-skeleton';
export * from './blocks/layout/pull-to-refresh';
export * from './blocks/navigation/header';
export * from './blocks/navigation/drawer-menu';

export * from './platform';

export {
  controlRecipe,
  fieldRecipe,
  surfacePadding,
  surfaceRadius,
  tokenPx,
  typographyRecipe,
} from './lib/recipes';
export type { ControlSize, SurfacePadding, SurfaceRadius, TypographyRole } from './lib/recipes';

// Renderer-agnostic token layer, shared with the native track.
export * from '../tokens';
