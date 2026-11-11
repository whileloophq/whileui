import { fireEvent, render, screen } from '../../test/render';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('draws a tick only while checked, and announces the state', async () => {
    const onCheckedChange = jest.fn();
    await render(<Checkbox accessibilityLabel="Rin" onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole('checkbox', { name: 'Rin' });

    expect(box).not.toBeChecked();
    expect(screen.queryByTestId('checkbox-tick')).toBeNull();

    await fireEvent.press(box);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(box).toBeChecked();
    expect(screen.getByTestId('checkbox-tick')).toBeOnTheScreen();
  });
});
