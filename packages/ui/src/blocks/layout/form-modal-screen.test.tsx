import { Text } from 'react-native';
import { fireEvent, render, screen } from '../../test/render';
import { FormModalScreen } from './form-modal-screen';

describe('FormModalScreen', () => {
  it('draws Cancel and Save as text buttons that call their handlers', async () => {
    const onClose = jest.fn();
    const onSave = jest.fn();
    await render(
      <FormModalScreen title="New expense" onClose={onClose} onSave={onSave}>
        <Text>Amount</Text>
      </FormModalScreen>
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Save' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('header', { name: 'New expense' })).toBeOnTheScreen();
  });

  it('disables Save while it cannot save, and both while saving', async () => {
    const { rerender } = await render(
      <FormModalScreen title="New expense" onClose={jest.fn()} onSave={jest.fn()} saveDisabled>
        <Text>Amount</Text>
      </FormModalScreen>
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).not.toBeDisabled();

    await rerender(
      <FormModalScreen title="New expense" onClose={jest.fn()} onSave={jest.fn()} saving>
        <Text>Amount</Text>
      </FormModalScreen>
    );
    expect(screen.getByRole('button', { name: /Save/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });
});
