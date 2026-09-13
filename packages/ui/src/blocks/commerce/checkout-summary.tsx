import { View, type ViewProps } from 'react-native';
import { Text } from '../../components/text';
import { Separator } from '../../components/separator';
import { Button, ButtonText } from '../../components/button';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { surfacePadding, surfaceRadius, typographyStyle } from '../../lib/recipes';

export interface CheckoutLineItem {
  label: string;
  value: string;
  emphasized?: boolean;
}

export interface CheckoutSummaryProps extends ViewProps {
  items: CheckoutLineItem[];
  subtotal: string;
  shipping?: string;
  tax?: string;
  discount?: string;
  total: string;
  buttonLabel?: string;
  onCheckout?: () => void;
  loading?: boolean;
}

export function CheckoutSummary({
  items,
  subtotal,
  shipping,
  tax,
  discount,
  total,
  buttonLabel = 'Checkout',
  onCheckout,
  loading = false,
  className,
  style,
  ...props
}: CheckoutSummaryProps) {
  const visual = useVisualTokens();
  const label = typographyStyle(visual, 'label');
  const body = typographyStyle(visual, 'body');
  const emphasis = typographyStyle(visual, 'emphasis');
  const title = typographyStyle(visual, 'title');

  return (
    <View
      className={cn('border border-border bg-card', className)}
      style={[
        {
          borderRadius: surfaceRadius(visual, 'xl'),
          padding: surfacePadding(visual, 'default'),
          borderWidth: visual.borderWidthHairline,
        },
        style,
      ]}
      {...props}
    >
      <Text className="mb-4 font-semibold text-foreground" style={emphasis}>
        Order Summary
      </Text>

      {items.length > 0 && (
        <View className="mb-4 gap-2">
          {items.map((item) => (
            <View
              key={`${item.label}:${item.value}`}
              className="flex-row items-center justify-between"
            >
              <Text
                className={cn(
                  item.emphasized ? 'font-medium text-foreground' : 'text-muted-foreground'
                )}
                style={label}
                numberOfLines={1}
              >
                {item.label}
              </Text>
              <Text
                className={cn(
                  item.emphasized ? 'font-medium text-foreground' : 'text-muted-foreground'
                )}
                style={label}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Separator className="my-3" />

      <View className="flex-row items-center justify-between">
        <Text className="text-muted-foreground" style={label}>
          Subtotal
        </Text>
        <Text className="text-foreground" style={label}>
          {subtotal}
        </Text>
      </View>

      {shipping && (
        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-muted-foreground" style={label}>
            Shipping
          </Text>
          <Text className="text-foreground" style={label}>
            {shipping}
          </Text>
        </View>
      )}

      {tax && (
        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-muted-foreground" style={label}>
            Tax
          </Text>
          <Text className="text-foreground" style={label}>
            {tax}
          </Text>
        </View>
      )}

      {/* Discount */}
      {discount && (
        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-muted-foreground" style={label}>
            Discount
          </Text>
          <Text className="text-primary" style={label}>
            -{discount}
          </Text>
        </View>
      )}

      <Separator className="my-3" />

      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-foreground" style={body}>
          Total
        </Text>
        <Text className="font-bold text-foreground" style={title}>
          {total}
        </Text>
      </View>

      {/* Checkout Button */}
      {onCheckout && (
        <Button className="mt-4 w-full" onPress={onCheckout} disabled={loading}>
          <ButtonText>{loading ? 'Processing...' : buttonLabel}</ButtonText>
        </Button>
      )}
    </View>
  );
}
