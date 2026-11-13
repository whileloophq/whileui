import { StyleSheet } from 'react-native';
import { FontProvider } from '../../lib/font-context';
import { render, screen } from '../../test/render';
import { Text } from './text';

describe('Text', () => {
  // A resolved font once carried 4pt of right padding on iOS and Android, which pushed
  // every centred label — badge counts, button labels, initials — 2pt left of centre.
  it('takes the app font without padding one side', async () => {
    await render(
      <FontProvider value={{ 'font-normal': 'Brand_400Regular', 'font-bold': 'Brand_700Bold' }}>
        <Text className="font-bold">12</Text>
      </FontProvider>
    );
    const style = StyleSheet.flatten(screen.getByText('12').props.style);

    expect(style).toMatchObject({ fontFamily: 'Brand_700Bold' });
    expect(style).not.toHaveProperty('paddingRight');
  });

  it('renders an eyebrow at the label scale in the muted colour', async () => {
    await render(<Text variant="eyebrow">Members</Text>);

    const eyebrow = screen.getByText('Members');
    expect(eyebrow.props.className).toContain('text-muted-foreground');
    expect(eyebrow).toHaveStyle({ fontSize: 13 });
  });

  it('gives headings semantic navigation and the headline token scale', async () => {
    await render(<Text variant="heading">Overview</Text>);

    const heading = screen.getByRole('header', { name: 'Overview' });
    expect(heading).toHaveStyle({ fontSize: 24 });
  });

  it('lets a caller override the semantic body style', async () => {
    await render(
      <Text variant="body" style={{ fontSize: 18 }}>
        Summary
      </Text>
    );

    expect(screen.getByText('Summary')).toHaveStyle({ fontSize: 18 });
  });

  it('does not override class-based sizing when no semantic role was requested', async () => {
    await render(<Text className="text-3xl">Custom display</Text>);

    expect(screen.getByText('Custom display')).not.toHaveStyle({ fontSize: 15 });
  });
});
