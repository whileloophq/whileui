import { Pressable } from 'react-native';
import { fireEvent, render, screen } from '../test/render';
import { useTapOnly } from './tap-only';

function Backdrop({ onDismiss }: { onDismiss: () => void }) {
  return <Pressable testID="backdrop" {...useTapOnly(onDismiss)} />;
}

const touch = (x: number, y: number) => ({ nativeEvent: { pageX: x, pageY: y } });

describe('useTapOnly', () => {
  it('fires for a tap and for movement within the touch slop', async () => {
    const onDismiss = jest.fn();
    await render(<Backdrop onDismiss={onDismiss} />);
    const backdrop = screen.getByTestId('backdrop');

    await fireEvent(backdrop, 'pressIn', touch(100, 100));
    await fireEvent(backdrop, 'press', touch(104, 97));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('ignores a drag that stays inside the view', async () => {
    const onDismiss = jest.fn();
    await render(<Backdrop onDismiss={onDismiss} />);
    const backdrop = screen.getByTestId('backdrop');

    await fireEvent(backdrop, 'pressIn', touch(100, 800));
    await fireEvent(backdrop, 'press', touch(100, 300));

    expect(onDismiss).not.toHaveBeenCalled();
  });
});
