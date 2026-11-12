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

describe('Checkbox with a label', () => {
  it('is one checkbox named by its label, toggled by pressing the text', async () => {
    const onCheckedChange = jest.fn();
    await render(
      <Checkbox
        label="Show archived groups"
        description="Groups you closed stay out of totals."
        onCheckedChange={onCheckedChange}
      />
    );

    expect(screen.getAllByRole('checkbox')).toHaveLength(1);
    const box = screen.getByRole('checkbox', { name: /Show archived groups/ });
    expect(screen.getByText('Groups you closed stay out of totals.')).toBeOnTheScreen();

    await fireEvent.press(screen.getByText('Show archived groups'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(box).toBeChecked();
  });
});

describe('naming an unlabelled checkbox', () => {
  it('puts accessibilityLabel and testID on the element that is the checkbox', async () => {
    await render(<Checkbox accessibilityLabel="Accept terms" testID="terms" />);
    const control = screen.getByRole('checkbox');
    expect(control.props.accessibilityLabel).toBe('Accept terms');
    expect(screen.getByTestId('terms')).toBe(control);
  });
});
