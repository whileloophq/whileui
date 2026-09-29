import { View, type ViewProps } from 'react-native';
import { Pressable } from '../../components/pressable';
import { Badge, BadgeText } from '../../components/badge';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { controlRecipe, typographyStyle } from '../../lib/recipes';

export type PlanToggleValue = 'monthly' | 'annual';

export interface PlanToggleProps extends ViewProps {
  selected: PlanToggleValue;
  monthlyLabel?: string;
  annualLabel?: string;
  annualDiscount?: string;
  onChange?: (value: PlanToggleValue) => void;
  className?: string;
}

export function PlanToggle({
  selected,
  monthlyLabel = 'Monthly',
  annualLabel = 'Annual',
  annualDiscount,
  onChange,
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
        // A two-state chooser is a toggle button; `aria-pressed` is the state ARIA
        // allows on that role.
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        aria-pressed={active}
        className={cn(
          'flex-1 flex-row items-center justify-center gap-2',
          active ? 'bg-background border border-border' : 'bg-transparent'
        )}
        feedback="default"
        style={[segmentStyle, active ? { borderWidth: visual.borderWidthHairline } : null]}
        disabled={!onChange}
        onPress={() => onChange?.(value)}
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
