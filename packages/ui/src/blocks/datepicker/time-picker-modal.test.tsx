import { act, render, screen, userEvent } from '../../test/render';
import { Text } from '../../components/text';
import { TimePickerModal, formatDisplayTime, parseTime } from './time-picker-modal';

describe('TimePickerModal', () => {
  it('shows its title, confirm action and both wheels while open', async () => {
    await render(
      <TimePickerModal
        open
        value="09:05"
        hourCycle="h23"
        onOpenChange={jest.fn()}
        onValueChange={jest.fn()}
        title="Pick a time"
        confirmLabel="Done"
      />
    );

    expect(screen.getByRole('header', { name: 'Pick a time' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Done' })).toBeOnTheScreen();
    expect(screen.getByRole('adjustable', { name: 'Hour' })).toHaveProp('accessibilityValue', {
      text: '09',
    });
    expect(screen.getByRole('adjustable', { name: 'Minute' })).toHaveProp('accessibilityValue', {
      text: '05',
    });
    expect(screen.queryByRole('adjustable', { name: 'AM or PM' })).toBeNull();
  });

  it('confirms the current value in 24-hour form and closes', async () => {
    const onValueChange = jest.fn();
    const onOpenChange = jest.fn();
    const user = userEvent.setup();
    await render(
      <TimePickerModal
        open
        value="22:30"
        hourCycle="h12"
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.getByRole('adjustable', { name: 'Hour' })).toHaveProp('accessibilityValue', {
      text: '10',
    });
    expect(screen.getByRole('adjustable', { name: 'AM or PM' })).toHaveProp('accessibilityValue', {
      text: 'PM',
    });

    await user.press(screen.getByRole('button', { name: 'Done' }));

    expect(onValueChange).toHaveBeenCalledWith('22:30');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('steps a wheel from its accessibility actions and wraps at the end', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    await render(
      <TimePickerModal
        open
        value="23:59"
        hourCycle="h23"
        onValueChange={onValueChange}
        onOpenChange={jest.fn()}
      />
    );

    const hour = screen.getByRole('adjustable', { name: 'Hour' });
    const minute = screen.getByRole('adjustable', { name: 'Minute' });
    await act(async () => {
      hour.props.onAccessibilityAction({ nativeEvent: { actionName: 'increment' } });
      minute.props.onAccessibilityAction({ nativeEvent: { actionName: 'increment' } });
    });

    expect(screen.getByRole('adjustable', { name: 'Hour' })).toHaveProp('accessibilityValue', {
      text: '00',
    });
    await user.press(screen.getByRole('button', { name: 'Done' }));
    expect(onValueChange).toHaveBeenCalledWith('00:00');
  });

  it('dismisses from the platform request without committing a value', async () => {
    const onValueChange = jest.fn();
    const onOpenChange = jest.fn();
    const result = await render(
      <TimePickerModal
        open
        value="12:00"
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />
    );

    const [modal] = result.root!.queryAll((instance) => instance.type === 'Modal');
    await act(async () => {
      modal!.props.onRequestClose();
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('asks to open from its trigger', async () => {
    const onOpenChange = jest.fn();
    const user = userEvent.setup();
    await render(
      <TimePickerModal open={false} onOpenChange={onOpenChange} trigger={<Text>Choose</Text>} />
    );

    await user.press(screen.getByRole('button', { name: 'Choose' }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('parses and formats HH:MM', () => {
    expect(parseTime('7:05')).toEqual({ hour: 7, minute: 5 });
    expect(parseTime('24:00')).toBeNull();
    expect(parseTime('')).toBeNull();
    expect(formatDisplayTime('22:30', 'h23')).toBe('22:30');
    expect(formatDisplayTime('22:30', 'h12')).toMatch(/10:30\s?PM/);
    expect(formatDisplayTime(null)).toBe('Select time');
  });
});
