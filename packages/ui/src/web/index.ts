// WhileUI DOM track. Lives beside the native track until the 2.0 split moves it
// to the package root. Anything host-specific belongs in `platform/`.

export * from './components/button';
export * from './components/card';
export * from './components/error-boundary';
export * from './lib/theme-provider';

export * from './blocks/layout/app-shell';
export * from './blocks/navigation/header';
export * from './blocks/navigation/drawer-menu';

export * from './platform';

export { controlRecipe, surfacePadding } from './lib/recipes';
export type { ControlSize, SurfacePadding } from './lib/recipes';

// Renderer-agnostic token layer, shared with the native track.
export * from '../tokens';
