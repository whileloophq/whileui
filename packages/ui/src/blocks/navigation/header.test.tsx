import { render, screen } from '../../test/render';
import { Text } from '../../components/text';
import { Header } from './header';

describe('Header', () => {
  it('names icon-only actions from their accessibilityLabel', async () => {
    const onPress = jest.fn();
    await render(
      <Header
        title="Settings"
        rightActions={[
          { key: 'search', icon: <Text>🔍</Text>, onPress, accessibilityLabel: 'Search' },
        ]}
      />
    );

    expect(screen.getByRole('button', { name: 'Search' })).toBeOnTheScreen();
  });
});
