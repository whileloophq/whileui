import * as React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import * as SelectPrimitive from '@rn-primitives/select';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';
import { Text } from '../text';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
import { useInteractionTokens } from '../../lib/interaction-tokens';
import { useFrostedSurface, type FrostedSurfaceProps } from '../../lib/frosted-surface';
import { useVisualTokens } from '../../lib/visual-tokens';
import { useThemeColors } from '../../lib/theme-colors';
import { fieldRecipe, shadowStyle, surfaceRadius, typographyStyle } from '../../lib/recipes';

// iOS needs FullWindowOverlay to render above everything
const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

export type SelectOption = SelectPrimitive.Option;

export type SelectTriggerRef = SelectPrimitive.TriggerRef;

export interface SelectProps {
  defaultValue?: SelectOption;
  value?: SelectOption;
  onValueChange?: (option: SelectOption | undefined) => void;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface SelectTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
  'style'
> {
  className?: string;
  /**
   * Object form only. On web this primitive is merged through a Slot that spreads
   * `style`, which cannot carry a state callback — a function silently becomes `{}` and
   * every style is lost. Rejecting it at compile time is the honest contract, and it is
   * the same on both platforms so the API does not diverge.
   */
  style?: StyleProp<ViewStyle>;
}

export interface SelectValueProps {
  className?: string;
  placeholder?: string;
}

export interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, FrostedSurfaceProps {
  className?: string;
  portalHost?: string;
  insets?: { top?: number; bottom?: number; left?: number; right?: number };
}

export interface SelectItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>,
  'style'
> {
  className?: string;
  children?: React.ReactNode;
  /** Object form only — see `SelectTriggerProps.style`. */
  style?: StyleProp<ViewStyle>;
}

export interface SelectItemIconProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SelectGroupProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Group
> {
  className?: string;
}

export interface SelectLabelProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Label
> {
  className?: string;
}

export interface SelectSeparatorProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Separator
> {
  className?: string;
}

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectTrigger = React.forwardRef<SelectTriggerRef, SelectTriggerProps>(
  ({ className, children, style: styleProp, ...props }, ref) => {
    const interaction = useInteractionTokens();
    const visual = useVisualTokens();

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
          'border-border bg-muted flex w-full flex-row items-center justify-between gap-2 shadow-sm active:bg-state-pressed',
          focusRing,
          props.disabled && '',
          className
        )}
        // Pass an array unless the caller actually gave a callback. On web this primitive
        // is wrapped in a Slot that merges `style` by object spread, which turns a
        // function into `{}` and silently drops every style — the trigger rendered 24px
        // tall with no padding, border or radius. A callback is still honoured on native,
        // where dropping it was the original bug.
        // Flattened, not an array. On web this primitive is merged through a Slot that
        // spreads `style`, and spreading an array yields { 0: …, 1: … } — numeric keys
        // that reach the DOM as indexed style properties and throw. The Select rendered
        // nothing at all on web because of this.
        style={StyleSheet.flatten([
          fieldRecipe(visual, 'default'),
          styleProp,
          props.disabled ? { opacity: interaction.disabledOpacity } : null,
        ])}
        {...props}
      >
        <>{children}</>
        <View className="border-muted-foreground h-2 w-2 rotate-45 border-b-2 border-r-2" />
      </SelectPrimitive.Trigger>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

function SelectValue({
  className,
  placeholder = 'Select...',
  ...props
}: SelectValueProps & React.RefAttributes<SelectPrimitive.ValueRef>) {
  const { value } = SelectPrimitive.useRootContext();
  const visual = useVisualTokens();

  // The colour is set on a wrapper and inherited, rather than on the primitive itself.
  // Its web build wraps a Radix span in a `Slot.Text` that drops React Native props, so
  // neither `className` nor `style` reached the DOM and the text fell back to the
  // user-agent default black — 1.2:1 on a dark surface. Rendering the label ourselves
  // instead would fix the colour and lose the value: Radix owns the selection on web,
  // and `useRootContext().value` is not populated there.
  return (
    <Text
      className={cn('text-foreground', !value && 'text-muted-foreground', className)}
      style={typographyStyle(visual, 'body')}
      numberOfLines={1}
    >
      <SelectPrimitive.Value placeholder={placeholder} {...props} />
    </Text>
  );
}

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(
  (
    {
      className,
      children,
      portalHost,
      position = 'popper',
      insets,
      style: styleProp,
      frosted = false,
      blurIntensity,
      blurTintToken,
      ...props
    },
    ref
  ) => {
    const frostedSurface = useFrostedSurface({
      frosted,
      blurIntensity,
      blurTintToken,
      defaultTintToken: 'popover',
      defaultBlurPreset: 'subtle',
    });
    const visual = useVisualTokens();
    const colors = useThemeColors();

    return (
      <SelectPrimitive.Portal hostName={portalHost}>
        <FullWindowOverlay>
          <SelectPrimitive.Overlay style={Platform.select({ native: StyleSheet.absoluteFill })}>
            <SelectPrimitive.Content
              ref={ref}
              position={position}
              insets={insets}
              style={StyleSheet.flatten([
                {
                  borderRadius: surfaceRadius(visual, 'lg'),
                  borderWidth: visual.borderWidthHairline,
                },
                shadowStyle(visual, colors, 'md'),
                frostedSurface.surfaceStyle,
                styleProp,
              ])}
              className={cn(
                'border-border relative z-50 min-w-32 overflow-hidden',
                frosted ? 'bg-transparent' : 'bg-popover',
                Platform.select({
                  web: cn(
                    'max-h-96 overflow-y-auto overflow-x-hidden',
                    props.side === 'bottom' && 'translate-y-1',
                    props.side === 'top' && '-translate-y-1'
                  ),
                  native: 'p-1',
                }),
                className
              )}
              {...props}
            >
              {frostedSurface.overlay}
              <SelectPrimitive.Viewport
                className={cn(
                  'p-1',
                  position === 'popper' &&
                    Platform.select({
                      web: 'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)',
                    })
                )}
              >
                {children}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Overlay>
        </FullWindowOverlay>
      </SelectPrimitive.Portal>
    );
  }
);
SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, style: styleProp, ...props }, ref) => {
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        'active:bg-accent group relative flex w-full flex-row items-center gap-2 pr-8',
        Platform.select({
          web: 'focus:bg-accent focus:text-accent-foreground cursor-default outline-none',
        }),
        props.disabled && '',
        className
      )}
      style={StyleSheet.flatten([
        {
          borderRadius: visual.radiusSm,
          minHeight: visual.touchTargetMinSize,
          paddingVertical: visual.controlPaddingYSm,
          paddingLeft: visual.controlPaddingXSm,
        },
        styleProp,
        props.disabled ? { opacity: interaction.disabledOpacity } : null,
      ])}
      {...props}
    >
      <View className="absolute right-3 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <View className="border-foreground h-2.5 w-1.5 rotate-45 border-b-2 border-r-2 -mt-0.5" />
        </SelectPrimitive.ItemIndicator>
      </View>
      {children}
      <SelectPrimitive.ItemText
        className="text-foreground group-active:text-accent-foreground"
        style={typographyStyle(visual, 'body')}
      />
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = 'SelectItem';

function SelectItemIcon({ className, children }: SelectItemIconProps) {
  return <View className={cn('items-center justify-center', className)}>{children}</View>;
}
SelectItemIcon.displayName = 'SelectItemIcon';

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, style: styleProp, ...props }, ref) => {
  const visual = useVisualTokens();
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn('text-muted-foreground px-2 py-2', className)}
      style={StyleSheet.flatten([typographyStyle(visual, 'caption'), styleProp])}
      {...props}
    />
  );
});
SelectLabel.displayName = 'SelectLabel';

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  SelectSeparatorProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(
      'bg-border -mx-1 my-1 h-px',
      Platform.select({ web: 'pointer-events-none' }),
      className
    )}
    {...props}
  />
));
SelectSeparator.displayName = 'SelectSeparator';

/**
 * @platform Native only
 * Returns the children on web
 */
function NativeSelectScrollView({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollView>) {
  if (Platform.OS === 'web') {
    return <>{children}</>;
  }
  return (
    <ScrollView className={cn('max-h-52', className)} {...props}>
      {children}
    </ScrollView>
  );
}

export {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIcon,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
