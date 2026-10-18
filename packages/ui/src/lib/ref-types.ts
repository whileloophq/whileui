import type React from 'react';

/** A named public shape for ref-forwarding components under React Native's Strict API. */
export type ForwardRefComponent<TInstance, TProps> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TProps> & React.RefAttributes<TInstance>
>;
