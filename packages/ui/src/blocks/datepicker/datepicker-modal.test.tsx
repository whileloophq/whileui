import { act, render, screen, userEvent } from '../../test/render';
import { Text } from '../../components/text';
import { DatePickerModal } from './datepicker-modal';

describe('DatePickerModal', () => {
  it('shows its title and confirm action while open', async () => {
    await render(
      <DatePickerModal
        open
        value="2026-01-15"
        onOpenChange={jest.fn()}
        onValueChange={jest.fn()}
        title="Pick a day"
        confirmLabel="Done"
      />
    );

    expect(screen.getByText('Pick a day')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Done' })).toBeOnTheScreen();
  });

  it('confirms the current value and closes', async () => {
    const onValueChange = jest.fn();
    const onOpenChange = jest.fn();
    const user = userEvent.setup();
    await render(
      <DatePickerModal
        open
        value="2026-01-15"
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />
    );

    await user.press(screen.getByRole('button', { name: 'Done' }));

    expect(onValueChange).toHaveBeenCalledWith('2026-01-15');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('dismisses from the platform request without committing a value', async () => {
    const onValueChange = jest.fn();
    const onOpenChange = jest.fn();
    const result = await render(
      <DatePickerModal
        open
        value="2026-01-15"
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
      <DatePickerModal open={false} onOpenChange={onOpenChange} trigger={<Text>Choose</Text>} />
    );

    await user.press(screen.getByRole('button', { name: 'Choose' }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
