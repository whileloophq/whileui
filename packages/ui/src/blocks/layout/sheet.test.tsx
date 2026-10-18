import { render, screen } from '../../test/render';
import { Text } from '../../components/text';
import { Sheet, SheetContent } from './sheet';

describe('Sheet', () => {
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

  it('closes from the platform dismiss request — Android back, web Escape', async () => {
    const onOpenChange = jest.fn();
    const result = await render(
      <Sheet open onOpenChange={onOpenChange}>
        <SheetContent>
          <Text>Body</Text>
        </SheetContent>
      </Sheet>
    );

    const [modal] = result.root!.queryAll((instance) => instance.type === 'Modal');
    modal!.props.onRequestClose();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
