import { render, screen } from '../test/render';
import { ProductCard } from './commerce/product-card';
import { PricingCard } from './commerce/pricing-card';
import { ListItem } from './lists/list-item';

/** Findings from the accessibility sweep: each failed before its fix. */
describe('sweep', () => {
  it('a pressable ProductCard is a button; a static one is not', async () => {
    await render(
      <>
        <ProductCard title="Kettle" price="$40" onPress={jest.fn()} />
        <ProductCard title="Mug" price="$12" />
      </>
    );
    expect(screen.getByRole('button', { name: /Kettle/ })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: /Mug/ })).toBeNull();
  });

  it('a ListItem chevron is decoration, and only a pressable item has one', async () => {
    await render(
      <>
        <ListItem title="Profile" onPress={jest.fn()} />
        <ListItem title="Version" />
      </>
    );
    expect(screen.queryByText('›')).toBeNull();
    expect(screen.getAllByText('›', { includeHiddenElements: true })).toHaveLength(1);
  });

  it('a PricingCard feature says whether it is included, not a symbol name', async () => {
    await render(
      <PricingCard
        name="Pro"
        price="$9"
        features={[
          { label: 'Unlimited groups', included: true },
          { label: 'Receipt scanning', included: false },
        ]}
      />
    );
    // The mark is a named image, so web hears the state too.
    expect(screen.getByRole('image', { name: 'Not included' })).toBeOnTheScreen();
    expect(screen.getByLabelText('Not included: Receipt scanning')).toBeOnTheScreen();
    expect(screen.getByLabelText('Included: Unlimited groups')).toBeOnTheScreen();
  });
});

describe('targets reach 24px without hitSlop, which web ignores', () => {
  const { StyleSheet } = jest.requireActual('react-native');
  const size = (el: { props: Record<string, unknown> }) => {
    const raw = el.props.style;
    const style = StyleSheet.flatten(
      typeof raw === 'function' ? raw({ pressed: false }) : raw
    ) as Record<string, number | undefined>;
    return Math.min(style.minWidth ?? style.width ?? 0, style.minHeight ?? style.height ?? 0);
  };

  it('a RadioGroupItem, an unlabelled Checkbox and a link Button', async () => {
    const { RadioGroup, RadioGroupItem } = jest.requireActual('../components/radio-group');
    const { Checkbox } = jest.requireActual('../components/checkbox');
    const { Button, ButtonText } = jest.requireActual('../components/button');
    await render(
      <>
        <RadioGroup value="a" onValueChange={jest.fn()}>
          <RadioGroupItem value="a" accessibilityLabel="Free plan" />
        </RadioGroup>
        <Checkbox accessibilityLabel="Accept" />
        <Button variant="link">
          <ButtonText>Forgot?</ButtonText>
        </Button>
      </>
    );
    expect(size(screen.getByRole('radio'))).toBeGreaterThanOrEqual(24);
    expect(size(screen.getByRole('checkbox'))).toBeGreaterThanOrEqual(24);
    // A link is as wide as its text; only its height can fall short.
    const link = screen.getByRole('link');
    const linkStyle = StyleSheet.flatten(
      typeof link.props.style === 'function'
        ? link.props.style({ pressed: false })
        : link.props.style
    );
    expect(linkStyle.minHeight).toBeGreaterThanOrEqual(24);
  });
});

describe('BottomNav names each tab itself', () => {
  it('reads the label, then the badge, and nothing from the icon', async () => {
    const { Text } = jest.requireActual('react-native');
    const { BottomNav } = jest.requireActual('./navigation/bottom-nav');
    await render(
      <BottomNav
        activeKey="home"
        onSelect={jest.fn()}
        items={[
          { key: 'home', label: 'Home', icon: <Text>H</Text>, badge: 3 },
          { key: 'inbox', label: 'Inbox', icon: <Text>I</Text> },
        ]}
      />
    );
    // iOS built "3, Home" from the children, badge first, and on device the active tab
    // also exposed its icon glyph as an element of its own.
    expect(screen.getByRole('tab', { name: 'Home, 3' }).props.accessibilityLabel).toBe('Home, 3');
    expect(screen.getByRole('tab', { name: 'Inbox' }).props.accessibilityLabel).toBe('Inbox');
  });
});
