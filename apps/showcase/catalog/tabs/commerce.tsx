import { useState } from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  Button,
  ButtonText,
  CheckoutSummary,
  FeatureGate,
  MetricCard,
  PlanToggle,
  PricingCard,
  ProductCard,
  Row,
  Skeleton,
  SmartImage,
  Stack,
  SubscriptionCard,
  Text,
  UpgradeBanner,
  UsageBar,
} from '@thewhileloop/whileui';
import { Section } from '../ui';

export function CommerceBlocksTab() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);

  return (
    <View className="gap-6">
      <Section title="Product Cards" subtitle="Vertical and horizontal layouts">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <ProductCard
              title="Wireless Earbuds"
              price="$129"
              originalPrice="$179"
              badge="–28%"
              rating={4.7}
              reviewCount={842}
            />
          </View>
          <View className="flex-1">
            <ProductCard title="Smart Watch" price="$249" rating={4.9} reviewCount={1203} />
          </View>
        </View>
        <ProductCard
          variant="horizontal"
          title="Noise-Cancelling Headphones"
          price="$299"
          rating={4.8}
          reviewCount={2156}
        />
      </Section>

      <Section title="Loading States" subtitle="Component-level skeleton placeholders">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <ProductCard loading title="" price="" />
          </View>
          <View className="flex-1">
            <ProductCard loading title="" price="" />
          </View>
        </View>
        <ProductCard loading variant="horizontal" title="" price="" className="mt-3" />
        <Row gap="md" className="mt-3">
          <MetricCard loading label="" value="" className="flex-1" />
          <MetricCard loading label="" value="" className="flex-1" />
        </Row>
        <SubscriptionCard loading planName="" price="" className="mt-3" />
        <PricingCard loading name="" price="" features={[]} className="mt-3" />
      </Section>

      <Section title="Pricing" subtitle="Subscription plans">
        <PlanToggle
          value={billingCycle}
          onValueChange={setBillingCycle}
          annualDiscount="Save 20%"
          className="mb-3"
        />
        <PricingCard
          name="Pro"
          description="For teams and growing products"
          price={billingCycle === 'annual' ? '$24' : '$29'}
          period={billingCycle === 'annual' ? '/month billed yearly' : '/month'}
          badge="Most Popular"
          highlighted
          features={[
            { label: 'Unlimited components', included: true },
            { label: 'Priority support', included: true },
            { label: 'Figma source files', included: true },
            { label: 'Custom themes', included: true },
            { label: 'White-label license', included: false },
          ]}
          onPress={() => {}}
        />
      </Section>

      <Section title="Subscription Card" subtitle="Current plan summary for settings screens">
        <SubscriptionCard
          planName="Pro"
          price="$29"
          period="/month"
          expiresAt="April 18, 2026"
          onManage={() => {}}
          onUpgrade={() => {}}
        />
      </Section>

      {showUpgradeBanner ? (
        <Section title="Upgrade Banner" subtitle="Inline upsell with dismiss action">
          <UpgradeBanner
            message="Unlock unlimited exports and advanced templates with Pro."
            actionLabel="See plans"
            onAction={() => {}}
            onDismiss={() => setShowUpgradeBanner(false)}
          />
        </Section>
      ) : (
        <Section title="Upgrade Banner" subtitle="Inline upsell with dismiss action">
          <Button variant="outline" onPress={() => setShowUpgradeBanner(true)}>
            <ButtonText>Show banner again</ButtonText>
          </Button>
        </Section>
      )}

      <Section title="Usage Bar" subtitle="Usage meter with warning/exceeded states">
        <View className="gap-4">
          <UsageBar label="AI generations today" used={8} limit={20} />
          <UsageBar label="Background removals" used={18} limit={20} />
          <UsageBar label="Video exports" used={25} limit={20} />
        </View>
      </Section>

      <Section title="Checkout" subtitle="Order summary">
        <CheckoutSummary
          items={[
            { label: 'Wireless Earbuds × 1', value: '$129.00' },
            { label: 'Smart Watch × 1', value: '$249.00' },
          ]}
          subtotal="$378.00"
          shipping="Free"
          tax="$30.24"
          discount="$37.80"
          total="$370.44"
          onCheckout={() => {}}
        />
      </Section>

      <Section title="Metric Card" subtitle="Progress bars and segmented stats">
        <Stack gap="md">
          <MetricCard
            label="Total Revenue"
            value="$12,450"
            subtitle="75% of Q1 target"
            progress={75}
          />
          <Row gap="md">
            <MetricCard label="Progress" value="75%" progress={75} className="flex-1" />
            <MetricCard
              label="Distribution"
              value="100%"
              segments={[
                { value: 40, color: '#22c55e' },
                { value: 30, color: '#eab308' },
                { value: 30, color: '#3b82f6' },
              ]}
              className="flex-1"
            />
          </Row>
        </Stack>
      </Section>

      <Section title="Feature Gate" subtitle="Locked feature overlay with upgrade CTA">
        <FeatureGate
          title="Advanced style transfer is locked"
          description="Upgrade to Pro to unlock high-resolution transfer presets."
          buttonLabel="Upgrade to Pro"
          onUpgrade={() => {}}
          icon={<Feather name="lock" size={20} color="#f59e0b" />}
        >
          <View className="h-24 items-center justify-center bg-muted">
            <Text className="text-sm text-muted-foreground">Previewed premium output</Text>
          </View>
        </FeatureGate>
      </Section>

      <Section title="Smart Image" subtitle="expo-image with skeleton loading and fallback">
        <Text variant="caption" className="text-muted-foreground mb-2">
          Skeleton (pulsing) shows while loading. Images may load too fast to see it.
        </Text>
        <View className="flex-row gap-3 mb-3">
          <View className="w-28 h-28 rounded-xl overflow-hidden">
            <Skeleton className="w-full h-full rounded-xl" />
          </View>
          <View className="w-28 h-28 rounded-xl overflow-hidden">
            <Skeleton className="w-full h-full rounded-xl" />
          </View>
        </View>
        <Text variant="caption" className="text-muted-foreground mb-2">
          SmartImage — same size boxes with skeleton while loading.
        </Text>
        <View className="flex-row gap-3">
          <View className="w-28 h-28 rounded-xl overflow-hidden bg-muted">
            <SmartImage
              source={{ uri: 'https://picsum.photos/seed/whileui1/280' }}
              alt="Sample image"
              className="w-full h-full"
            />
          </View>
          <View className="w-28 h-28 rounded-xl overflow-hidden bg-muted">
            <SmartImage
              source={{ uri: 'https://invalid-url-for-fallback-demo' }}
              alt="Fallback demo"
              fallbackSource={{ uri: 'https://picsum.photos/seed/whileui2/280' }}
              className="w-full h-full"
            />
          </View>
        </View>
      </Section>
    </View>
  );
}
