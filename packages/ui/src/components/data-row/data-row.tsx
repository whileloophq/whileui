import React, { createContext, useContext, useMemo } from 'react';
import { Text, View, type TextProps, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import { tv } from '../../lib/tv';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';

const dataRowVariants = tv({
  base: 'w-full flex-row items-center gap-3',
  variants: {
    size: {
      default: '',
      compact: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

function getDataRowStyle(visual: ReturnType<typeof useVisualTokens>, size: 'default' | 'compact') {
  if (size === 'compact') {
    return {
      minHeight: Math.round((visual.controlHeightSm + visual.controlHeightDefault) / 2),
      paddingVertical: Math.max(4, Math.round(visual.controlPaddingYSm * 0.75)),
    };
  }
  return {
    minHeight: visual.controlHeightDefault,
    paddingVertical: visual.controlPaddingYSm,
  };
}

const dataRowLabelVariants = tv({
  base: 'font-medium text-foreground',
  variants: {
    size: {
      default: '',
      compact: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const dataRowDescriptionVariants = tv({
  base: 'text-muted-foreground',
  variants: {
    size: {
      default: '',
      compact: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const dataRowValueVariants = tv({
  base: 'font-medium text-foreground text-right',
  variants: {
    size: {
      default: '',
      compact: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface DataRowContextValue {
  size: 'default' | 'compact';
}

const DataRowContext = createContext<DataRowContextValue>({
  size: 'default',
});

export interface DataRowProps extends ViewProps {
  size?: 'default' | 'compact';
  className?: string;
}

export interface DataRowLeftProps extends ViewProps {
  className?: string;
}

export interface DataRowCenterProps extends ViewProps {
  className?: string;
}

export interface DataRowRightProps extends ViewProps {
  className?: string;
}

export interface DataRowLabelProps extends TextProps {
  className?: string;
}

export interface DataRowDescriptionProps extends TextProps {
  className?: string;
}

export interface DataRowValueProps extends TextProps {
  className?: string;
}

const DataRow = React.forwardRef<View, DataRowProps>(
  ({ className, size = 'default', style, ...props }, ref) => {
    const visual = useVisualTokens();
    const contextValue = useMemo(() => ({ size }), [size]);
    return (
      <DataRowContext.Provider value={contextValue}>
        <View
          ref={ref}
          className={cn(dataRowVariants({ size }), className)}
          style={[getDataRowStyle(visual, size), style]}
          {...props}
        />
      </DataRowContext.Provider>
    );
  }
);

DataRow.displayName = 'DataRow';

const DataRowLeft = React.forwardRef<View, DataRowLeftProps>(({ className, ...props }, ref) => {
  return (
    <View ref={ref} className={cn('shrink-0 items-center justify-center', className)} {...props} />
  );
});

DataRowLeft.displayName = 'DataRowLeft';

const DataRowCenter = React.forwardRef<View, DataRowCenterProps>(({ className, ...props }, ref) => {
  return <View ref={ref} className={cn('min-w-0 flex-1 gap-0.5', className)} {...props} />;
});

DataRowCenter.displayName = 'DataRowCenter';

const DataRowRight = React.forwardRef<View, DataRowRightProps>(
  ({ className, style, ...props }, ref) => {
    const visual = useVisualTokens();
    return (
      <View
        ref={ref}
        className={cn('ml-2 shrink-0 items-end justify-center', className)}
        style={[{ maxWidth: `${visual.dataRowRightMaxWidthRatio * 100}%` }, style]}
        {...props}
      />
    );
  }
);

DataRowRight.displayName = 'DataRowRight';

const DataRowLabel = React.forwardRef<Text, DataRowLabelProps>(
  ({ className, style, ...props }, ref) => {
    const { size } = useContext(DataRowContext);
    const visual = useVisualTokens();

    return (
      <Text
        ref={ref}
        className={cn(dataRowLabelVariants({ size }), className)}
        style={[typographyStyle(visual, size === 'compact' ? 'caption' : 'label'), style]}
        numberOfLines={1}
        {...props}
      />
    );
  }
);

DataRowLabel.displayName = 'DataRowLabel';

const DataRowDescription = React.forwardRef<Text, DataRowDescriptionProps>(
  ({ className, style, ...props }, ref) => {
    const { size } = useContext(DataRowContext);
    const visual = useVisualTokens();

    return (
      <Text
        ref={ref}
        className={cn(dataRowDescriptionVariants({ size }), className)}
        style={
          size === 'compact'
            ? [{ fontSize: visual.dataRowCompactDescriptionSize }, style]
            : [typographyStyle(visual, 'caption'), style]
        }
        numberOfLines={2}
        {...props}
      />
    );
  }
);

DataRowDescription.displayName = 'DataRowDescription';

const DataRowValue = React.forwardRef<Text, DataRowValueProps>(
  ({ className, style, ...props }, ref) => {
    const { size } = useContext(DataRowContext);
    const visual = useVisualTokens();

    return (
      <Text
        ref={ref}
        className={cn(dataRowValueVariants({ size }), className)}
        style={[typographyStyle(visual, size === 'compact' ? 'caption' : 'label'), style]}
        numberOfLines={1}
        {...props}
      />
    );
  }
);

DataRowValue.displayName = 'DataRowValue';

export {
  DataRow,
  DataRowLeft,
  DataRowCenter,
  DataRowRight,
  DataRowLabel,
  DataRowDescription,
  DataRowValue,
  dataRowVariants,
};
