import { render, screen } from '../../test/render';
import { Text } from '../../components/text';
import { FloatingBottomNav } from './floating-bottom-nav';

describe('FloatingBottomNav', () => {
  it('names every tab, including inactive ones that render only an icon', async () => {
    await render(
      <FloatingBottomNav
        activeKey="home"
        onSelect={jest.fn()}
        items={[
          { key: 'home', label: 'Home', icon: <Text>H</Text> },
          { key: 'search', label: 'Search', icon: <Text>S</Text> },
        ]}
      />
    );

    expect(screen.getByRole('tab', { name: 'Home', selected: true })).toBeOnTheScreen();
    expect(screen.getByRole('tab', { name: 'Search', selected: false })).toBeOnTheScreen();
  });
});
