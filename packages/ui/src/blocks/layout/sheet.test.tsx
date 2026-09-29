import { render, screen } from '../../test/render';
import { Text } from '../../components/text';
import { Sheet, SheetContent } from './sheet';

describe('SheetContent', () => {
  it('owns nested scrolling while preserving caller content styles', async () => {
    await render(
      <Sheet open onOpenChange={jest.fn()} maxHeight="half">
        <SheetContent testID="sheet-content" contentContainerStyle={{ paddingBottom: 48 }}>
          <Text>Scrollable settings</Text>
        </SheetContent>
      </Sheet>
    );

    const content = screen.getByTestId('sheet-content');
    expect(content.props.nestedScrollEnabled).toBe(true);
    expect(content.props.keyboardShouldPersistTaps).toBe('handled');
    expect(content.props.contentContainerStyle).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ padding: expect.any(Number) }),
        { paddingBottom: 48 },
      ])
    );
  });
});
