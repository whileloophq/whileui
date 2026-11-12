import { render, screen, userEvent } from '../../test/render';
import { ToggleGroup, ToggleGroupItem, ToggleGroupItemText } from './toggle-group';

function Currencies(props: React.ComponentProps<typeof ToggleGroup>) {
  return (
    <ToggleGroup {...props}>
      {['USD', 'EUR', 'JPY'].map((code) => (
        <ToggleGroupItem key={code} value={code}>
          <ToggleGroupItemText>{code}</ToggleGroupItemText>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

describe('ToggleGroup', () => {
  it('single choice is a radio group that says which item is on', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    await render(<Currencies type="single" defaultValue="USD" onValueChange={onValueChange} />);

    // The group stays non-accessible so iOS keeps each radio reachable; RNTL only
    // queries accessible elements, so read the role off the parent.
    expect(screen.getByRole('radio', { name: 'USD' }).parent?.props.role).toBe('radiogroup');
    expect(screen.getByRole('radio', { name: 'USD' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'EUR' })).not.toBeChecked();

    await user.press(screen.getByRole('radio', { name: 'EUR' }));

    expect(onValueChange).toHaveBeenCalledWith('EUR');
    expect(screen.getByRole('radio', { name: 'EUR' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'USD' })).not.toBeChecked();
  });

  // On native several choices are checkboxes, each checked or not; on web the primitive
  // makes them pressed toggle buttons, which e2e/keyboard-patterns.spec.ts covers.
  it('multiple choice is a set of independent checked items', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    await render(<Currencies type="multiple" onValueChange={onValueChange} />);

    expect(screen.getByRole('checkbox', { name: 'USD' }).parent?.props.role).toBe('group');
    await user.press(screen.getByRole('checkbox', { name: 'USD' }));
    await user.press(screen.getByRole('checkbox', { name: 'JPY' }));

    expect(onValueChange).toHaveBeenLastCalledWith(['USD', 'JPY']);
    expect(screen.getByRole('checkbox', { name: 'USD' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'EUR' })).not.toBeChecked();
  });
});
