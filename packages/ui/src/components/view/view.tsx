import React from 'react';
import { View as RNView, type ViewInstance, type ViewProps as RNViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import type { ForwardRefComponent } from '../../lib/ref-types';

export interface ViewProps extends RNViewProps {}

const View: ForwardRefComponent<ViewInstance, ViewProps> = React.forwardRef(
  ({ className, ...props }, ref) => {
    return <RNView ref={ref} className={cn(className)} {...props} />;
  }
);

View.displayName = 'View';

export { View };
