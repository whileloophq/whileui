import { useState } from 'react';
import { render, screen, userEvent } from '../../test/render';
import { SegmentedControl, SegmentedControlItem } from './segmented-control';

function Segments({
  value,
  defaultValue,
  onValueChange,
  disabled,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <SegmentedControl
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SegmentedControlItem value="day">Day</SegmentedControlItem>
      <SegmentedControlItem value="week">Week</SegmentedControlItem>
    </SegmentedControl>
  );
}

describe('SegmentedControl', () => {
  it('exposes a radio group whose selected item is checked', async () => {
    await render(<Segments defaultValue="day" />);

    const day = screen.getByRole('radio', { name: 'Day' });
    // The group role sits on the parent. `accessible` stays unset there: marking that
    // view accessible would hide these radios from VoiceOver.
    expect(day.parent?.props.accessibilityRole).toBe('radiogroup');
    expect(day).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Week' })).not.toBeChecked();
  });

  it('reports the newly selected value', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    await render(<Segments defaultValue="day" onValueChange={onValueChange} />);

    await user.press(screen.getByRole('radio', { name: 'Week' }));

    expect(onValueChange).toHaveBeenCalledWith('week');
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
  });

  it('does not report a press on the value that is already selected', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    await render(<Segments defaultValue="day" onValueChange={onValueChange} />);

    await user.press(screen.getByRole('radio', { name: 'Day' }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('stays on the value its owner gives it', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('day');
      return <Segments value={value} onValueChange={setValue} />;
    }
    await render(<Controlled />);

    await user.press(screen.getByRole('radio', { name: 'Week' }));

    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
  });

  it('does not change while the group is disabled', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    await render(<Segments defaultValue="day" disabled onValueChange={onValueChange} />);

    await user.press(screen.getByRole('radio', { name: 'Week' }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'Week' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked();
  });
});
