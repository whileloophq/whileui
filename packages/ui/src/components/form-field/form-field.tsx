import React, { createContext, useContext, useMemo } from 'react';
import { Text, View, type TextProps, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { useInteractionTokens } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';

const formFieldVariants = tv({
  base: 'w-full',
  variants: {
    density: {
      default: 'gap-1.5',
      compact: 'gap-1',
    },
  },
  defaultVariants: {
    density: 'default',
  },
});

const formControlVariants = tv({
  base: 'justify-center',
  variants: {
    density: {
      default: '',
      compact: '',
    },
    invalid: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    density: 'default',
    invalid: false,
  },
});

type FormFieldDensity = NonNullable<VariantProps<typeof formFieldVariants>['density']>;

interface FormFieldContextValue {
  density: FormFieldDensity;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}

const FormFieldContext = createContext<FormFieldContextValue>({
  density: 'default',
  invalid: false,
  disabled: false,
  required: false,
});

export interface FormFieldProps extends ViewProps, VariantProps<typeof formFieldVariants> {
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export interface FormLabelProps extends TextProps {
  showRequiredIndicator?: boolean;
}

export interface FormControlProps extends ViewProps {}

export interface FormHintProps extends TextProps {}

export interface FormMessageProps extends TextProps {}

const FormField = React.forwardRef<View, FormFieldProps>(
  (
    {
      className,
      density = 'default',
      invalid = false,
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const interaction = useInteractionTokens();
    const contextValue = useMemo(
      () => ({ density, invalid, disabled, required }),
      [density, disabled, invalid, required]
    );
    return (
      <FormFieldContext.Provider value={contextValue}>
        <View
          ref={ref}
          className={cn(formFieldVariants({ density }), className)}
          style={disabled ? { opacity: interaction.disabledOpacitySoft } : undefined}
          {...props}
        />
      </FormFieldContext.Provider>
    );
  }
);

FormField.displayName = 'FormField';

const FormLabel = React.forwardRef<Text, FormLabelProps>(
  ({ className, showRequiredIndicator = true, children, style, ...props }, ref) => {
    const { invalid, disabled, required } = useContext(FormFieldContext);
    const visual = useVisualTokens();

    return (
      <Text
        ref={ref}
        className={cn(
          'font-medium text-foreground',
          invalid && 'text-destructive',
          disabled && 'text-muted-foreground',
          className
        )}
        style={[typographyStyle(visual, 'label'), style]}
        {...props}
      >
        {children}
        {required && showRequiredIndicator ? <Text className="text-destructive"> *</Text> : null}
      </Text>
    );
  }
);

FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<View, FormControlProps>(
  ({ className, style, ...props }, ref) => {
    const { density, invalid, disabled } = useContext(FormFieldContext);
    const interaction = useInteractionTokens();
    const visual = useVisualTokens();

    return (
      <View
        ref={ref}
        className={cn(
          formControlVariants({ density, invalid }),
          invalid && 'ring-1 ring-destructive-soft-border',
          className
        )}
        style={[
          {
            minHeight: density === 'compact' ? visual.controlHeightSm : visual.controlHeightDefault,
          },
          invalid ? { borderRadius: visual.radiusMd } : null,
          disabled ? { opacity: interaction.disabledOpacitySoft } : null,
          style,
        ]}
        {...props}
      />
    );
  }
);

FormControl.displayName = 'FormControl';

const FormHint = React.forwardRef<Text, FormHintProps>(({ className, style, ...props }, ref) => {
  const { invalid } = useContext(FormFieldContext);
  const visual = useVisualTokens();

  return (
    <Text
      ref={ref}
      className={cn('text-muted-foreground', invalid && 'text-destructive-muted', className)}
      style={[typographyStyle(visual, 'caption'), style]}
      {...props}
    />
  );
});

FormHint.displayName = 'FormHint';

const FormMessage = React.forwardRef<Text, FormMessageProps>(
  ({ className, children, style, ...props }, ref) => {
    const visual = useVisualTokens();

    if (children === undefined || children === null || children === false) {
      return null;
    }

    return (
      <Text
        ref={ref}
        className={cn('font-medium text-destructive', className)}
        style={[typographyStyle(visual, 'caption'), style]}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

FormMessage.displayName = 'FormMessage';

export {
  FormField,
  FormLabel,
  FormControl,
  FormHint,
  FormMessage,
  formFieldVariants,
  formControlVariants,
};
