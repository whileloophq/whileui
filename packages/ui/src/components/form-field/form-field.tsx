import React, { createContext, useContext, useId, useMemo } from 'react';
import {
  Text,
  View,
  type TextInstance,
  type TextProps,
  type ViewInstance,
  type ViewProps,
} from 'react-native';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { useInteractionTokens } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';
import type { ForwardRefComponent } from '../../lib/ref-types';

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

export interface FormFieldState {
  density: FormFieldDensity;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
  /** Set inside a FormField: `FormLabel` takes it as its id and controls point to it. */
  labelId?: string;
}

const FormFieldContext = createContext<FormFieldState>({
  density: 'default',
  invalid: false,
  disabled: false,
  required: false,
});

export function useFormFieldState(): FormFieldState {
  return useContext(FormFieldContext);
}

interface CallerNaming {
  accessibilityLabel?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  accessibilityLabelledBy?: string | string[];
}

/**
 * Accessibility props that tie a text control to its FormField: named by the FormLabel
 * unless the caller names or links it any of the four ways React Native allows, and
 * required when the field is. Spread before the caller's props. iOS has no labelled-by;
 * VoiceOver reads the visible label just before the field.
 */
export function fieldAccessibilityProps(field: FormFieldState, props: CallerNaming) {
  const named =
    props.accessibilityLabel ??
    props['aria-label'] ??
    props['aria-labelledby'] ??
    props.accessibilityLabelledBy;
  return {
    'aria-labelledby': named ? undefined : field.labelId,
    'aria-required': field.required || undefined,
  };
}

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

const FormField: ForwardRefComponent<ViewInstance, FormFieldProps> = React.forwardRef(
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
    const labelId = useId();
    const contextValue = useMemo(
      () => ({ density, invalid, disabled, required, labelId }),
      [density, disabled, invalid, labelId, required]
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

const FormLabel: ForwardRefComponent<TextInstance, FormLabelProps> = React.forwardRef(
  ({ className, showRequiredIndicator = true, children, style, ...props }, ref) => {
    const { invalid, disabled, required, labelId } = useContext(FormFieldContext);
    const visual = useVisualTokens();
    const indicator = required && showRequiredIndicator;

    return (
      <Text
        ref={ref}
        nativeID={labelId}
        // iOS reads nested Text as one string, so hiding the asterisk alone still says
        // "star"; a plain-text label names it once. The control announces "required".
        accessibilityLabel={indicator && typeof children === 'string' ? children : undefined}
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
        {indicator ? (
          <Text aria-hidden className="text-destructive">
            {' *'}
          </Text>
        ) : null}
      </Text>
    );
  }
);

FormLabel.displayName = 'FormLabel';

const FormControl: ForwardRefComponent<ViewInstance, FormControlProps> = React.forwardRef(
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

const FormHint: ForwardRefComponent<TextInstance, FormHintProps> = React.forwardRef(
  ({ className, style, ...props }, ref) => {
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
  }
);

FormHint.displayName = 'FormHint';

const FormMessage: ForwardRefComponent<TextInstance, FormMessageProps> = React.forwardRef(
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
