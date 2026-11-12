import { View, type ViewProps } from 'react-native';
import { Pressable } from '../../components/pressable';
import { Badge, BadgeText } from '../../components/badge';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { controlRecipe, typographyStyle } from '../../lib/recipes';

export type PlanToggleValue = 'monthly' | 'annual';

export interface PlanToggleProps extends ViewProps {
  /** The chosen billing period. */
  value: PlanToggleValue;
  monthlyLabel?: string;
  annualLabel?: string;
  annualDiscount?: string;
  /** Called with the period the user chose. Without it the toggle is read-only. */
  onValueChange?: (value: PlanToggleValue) => void;
  className?: string;
}

export function PlanToggle({
  value: selected,
  monthlyLabel = 'Monthly',
  annualLabel = 'Annual',
  annualDiscount,
  onValueChange,
  className,
  style,
  ...props
}: PlanToggleProps) {
  const visual = useVisualTokens();
  const segmentStyle = controlRecipe(visual, 'sm');
  const labelStyle = typographyStyle(visual, 'label');

  const renderItem = (value: PlanToggleValue, label: string) => {
    const active = selected === value;
    return (
      <Pressable
        key={value}
        // A two-state chooser is a toggle button: pressed on web, selected on native,
        // where React Native has no `aria-pressed`.
        // eslint-disable-next-line no-restricted-syntax -- the native half of aria-pressed
        accessibilityState={{ selected: active }}
        aria-pressed={active}
        className={cn(
          'flex-1 flex-row items-center justify-center gap-2',
          active ? 'bg-background border border-border' : 'bg-transparent'
        )}
        feedback="default"
        style={[segmentStyle, active ? { borderWidth: visual.borderWidthHairline } : null]}
        disabled={!onValueChange}
        onPress={() => onValueChange?.(value)}
      >
        <Text
          className={cn(active ? 'text-foreground' : 'text-muted-foreground')}
          style={labelStyle}
        >
          {label}
        </Text>
        {value === 'annual' && annualDiscount ? (
          <Badge variant="success">
            <BadgeText>{annualDiscount}</BadgeText>
          </Badge>
        ) : null}
      </Pressable>
    );
  };

  return (
    <View
      className={cn('bg-muted p-1', className)}
      style={[{ borderRadius: visual.radiusLg }, style]}
      {...props}
    >
      <View className="flex-row">
        {[renderItem('monthly', monthlyLabel), renderItem('annual', annualLabel)]}
      </View>
    </View>
  );
}
