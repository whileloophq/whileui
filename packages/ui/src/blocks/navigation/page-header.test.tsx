import { Text } from 'react-native';
import { fireEvent, render, screen } from '../../test/render';
import { PageHeader } from './page-header';

describe('PageHeader', () => {
  it('reads the title as a heading under its kicker, with actions and content below', async () => {
    await render(
      <PageHeader
        kicker="Weekend in Kyoto"
        title="Settle up"
        description="Payments that clear the group."
        mark={<Text>KY</Text>}
        actions={<Text>Share</Text>}
      >
        <Text>Tabs</Text>
      </PageHeader>
    );

    expect(screen.getByRole('header', { name: 'Settle up' })).toBeOnTheScreen();
    for (const text of [
      'Weekend in Kyoto',
      'Payments that clear the group.',
      'KY',
      'Share',
      'Tabs',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('puts a back button first when given onBack', async () => {
    const onBack = jest.fn();
    await render(<PageHeader title="Settle up" onBack={onBack} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe('the back chevron', () => {
  it('is drawn and hidden, not a "‹" character that each font sets small and off-centre', async () => {
    await render(<PageHeader title="Lisbon trip" onBack={jest.fn()} />);
    expect(screen.queryByText('‹', { includeHiddenElements: true })).toBeNull();
    expect(screen.getByTestId('chevron-glyph', { includeHiddenElements: true })).toBeTruthy();
  });
});
