import { render, screen } from '../../test/render';
import { Text } from '../../components/text';
import { FloatingBottomNav } from './floating-bottom-nav';

describe('FloatingBottomNav', () => {
  it('names every tab, including inactive ones that render only an icon', async () => {
    await render(
      <FloatingBottomNav
        value="home"
        onValueChange={jest.fn()}
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

describe('navigation bar icons', () => {
  it('give each icon its tab colour: readable on the active pill, muted elsewhere', async () => {
    const { BottomNav } = jest.requireActual('./bottom-nav');
    const { useThemeColors } = jest.requireActual('../../lib/theme-colors');
    const seen: Record<string, { active: boolean; color: string }> = {};
    let colors: { primary: string; primaryForeground: string; mutedForeground: string } = {
      primary: '',
      primaryForeground: '',
      mutedForeground: '',
    };
    function Probe() {
      colors = useThemeColors();
      return null;
    }
    const items = ['home', 'search'].map((key) => ({
      key,
      label: key,
      icon: (state: { active: boolean; color: string }) => {
        seen[key] = state;
        return null;
      },
    }));

    await render(
      <>
        <Probe />
        <FloatingBottomNav value="home" onValueChange={jest.fn()} items={items} />
      </>
    );
    // The floating pill is filled with primary, so its icon takes primary-foreground.
    expect(seen.home).toEqual({ active: true, color: colors.primaryForeground });
    expect(seen.search).toEqual({ active: false, color: colors.mutedForeground });

    await render(<BottomNav value="search" onValueChange={jest.fn()} items={items} />);
    expect(seen.search).toEqual({ active: true, color: colors.primary });
    expect(seen.home).toEqual({ active: false, color: colors.mutedForeground });
  });
});
