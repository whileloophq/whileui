import React from 'react';
import { Text, type TextInstance, type TextProps } from 'react-native';
import { cn } from '../../lib/cn';
import { useResolveFontFamily } from '../../lib/font-context';
import type { ForwardRefComponent } from '../../lib/ref-types';

export interface LabelProps extends TextProps {}

const Label: ForwardRefComponent<TextInstance, LabelProps> = React.forwardRef(
  ({ className, style, ...props }, ref) => {
    const resolved = cn('text-sm font-medium text-foreground leading-tight', className);
    const font = useResolveFontFamily(resolved);
    return (
      <Text
        ref={ref}
        className={font ? font.className : resolved}
        style={font ? [font.style, style] : style}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';

export { Label };
