import { createRef, useState } from 'react';
import { Text, type TextInputInstance } from 'react-native';
import { render, screen, userEvent } from '../../test/render';
import { NumericInput } from './numeric-input';

describe('NumericInput', () => {
  it('reports a typed number and ignores other characters', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    await render(<NumericInput accessibilityLabel="Amount" onValueChange={onValueChange} />);

    await user.type(screen.getByLabelText('Amount'), '12a');

    expect(onValueChange).toHaveBeenLastCalledWith(12);
    expect(onValueChange).not.toHaveBeenCalledWith(null);
  });

  it('holds the value its owner gives it when controlled', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<number | null>(null);
      return <NumericInput accessibilityLabel="Amount" value={value} onValueChange={setValue} />;
    }
    await render(<Controlled />);

    await user.type(screen.getByLabelText('Amount'), '4');

    expect(screen.getByDisplayValue('4')).toBeOnTheScreen();
  });

  it('steps within min and max', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    await render(
      <NumericInput
        accessibilityLabel="Amount"
        value={1}
        min={0}
        max={2}
        showSteppers
        onValueChange={onValueChange}
      />
    );

    await user.press(screen.getByRole('button', { name: 'Increase value' }));
    expect(onValueChange).toHaveBeenLastCalledWith(2);

    await user.press(screen.getByRole('button', { name: 'Decrease value' }));
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it('disables a stepper that would leave the range', async () => {
    await render(
      <NumericInput accessibilityLabel="Amount" value={2} min={0} max={2} showSteppers />
    );

    expect(screen.getByRole('button', { name: 'Increase value' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrease value' })).not.toBeDisabled();
  });

  it('ignores input while not editable', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    await render(
      <NumericInput accessibilityLabel="Amount" editable={false} onValueChange={onValueChange} />
    );

    await user.type(screen.getByLabelText('Amount'), '5');

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Amount')).toBeDisabled();
  });

  it('renders prefix and suffix content', async () => {
    await render(
      <NumericInput accessibilityLabel="Amount" prefix={<Text>$</Text>} suffix={<Text>USD</Text>} />
    );
    expect(screen.getByText('$')).toBeOnTheScreen();
    expect(screen.getByText('USD')).toBeOnTheScreen();
  });

  it('forwards its ref to the text input', async () => {
    const ref = createRef<TextInputInstance>();
    await render(<NumericInput ref={ref} accessibilityLabel="Amount" />);
    expect(ref.current).not.toBeNull();
  });
});
