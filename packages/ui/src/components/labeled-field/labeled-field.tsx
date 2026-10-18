import React from 'react';
import { View, type ViewInstance, type ViewProps } from 'react-native';
import {
  FormControl,
  FormField,
  FormHint,
  FormLabel,
  FormMessage,
  type FormFieldProps,
} from '../form-field';
import { cn } from '../../lib/cn';
import { useInteractionTokens } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import type { ForwardRefComponent } from '../../lib/ref-types';

export interface LabeledFieldProps extends Omit<FormFieldProps, 'children'> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  controlWrapperClassName?: string;
  children: React.ReactNode;
}

export interface LabeledFieldControlProps extends ViewProps {
  className?: string;
}

function LabeledField({
  label,
  hint,
  error,
  leftSlot,
  rightSlot,
  children,
  controlWrapperClassName,
  required,
  disabled,
  invalid,
  ...props
}: LabeledFieldProps) {
  const isInvalid = invalid ?? Boolean(error);
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();

  return (
    <FormField required={required} disabled={disabled} invalid={isInvalid} {...props}>
      {label ? <FormLabel>{label}</FormLabel> : null}
      <FormControl>
        <View
          className={cn(
            'flex-row items-center gap-2 border border-border bg-muted',
            isInvalid && 'border-destructive',
            disabled && '',
            controlWrapperClassName
          )}
          style={[
            {
              borderRadius: visual.radiusLg,
              borderWidth: visual.borderWidthControl,
              paddingHorizontal: visual.controlPaddingXDefault,
            },
            disabled ? { opacity: interaction.disabledOpacitySoft } : null,
          ]}
        >
          {leftSlot ? <View className="shrink-0">{leftSlot}</View> : null}
          <View
            className="min-w-0 flex-1 justify-center"
            style={{ minHeight: visual.controlHeightDefault }}
          >
            {children}
          </View>
          {rightSlot ? <View className="shrink-0">{rightSlot}</View> : null}
        </View>
      </FormControl>
      {error ? <FormMessage>{error}</FormMessage> : hint ? <FormHint>{hint}</FormHint> : null}
    </FormField>
  );
}

const LabeledFieldControl: ForwardRefComponent<ViewInstance, LabeledFieldControlProps> =
  React.forwardRef(({ className, ...props }, ref) => {
    return <View ref={ref} className={cn('min-w-0 flex-1', className)} {...props} />;
  });

LabeledFieldControl.displayName = 'LabeledFieldControl';

export { LabeledField, LabeledFieldControl };
