import { createRef, useState } from 'react';
import { type TextInputInstance } from 'react-native';
import { render, screen, userEvent } from '../../test/render';
import { INTERACTION_TOKENS } from '../../lib/interaction-tokens';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders its placeholder as a multiline field', async () => {
    await render(<Textarea placeholder="Notes" />);
    const field = screen.getByPlaceholderText('Notes');
    expect(field).toBeOnTheScreen();
    expect(field.props.multiline).toBe(true);
  });

  it('reports each keystroke to onChangeText', async () => {
    const onChangeText = jest.fn();
    const user = userEvent.setup();
    await render(<Textarea placeholder="Notes" onChangeText={onChangeText} />);

    await user.type(screen.getByPlaceholderText('Notes'), 'hi');

    expect(onChangeText).toHaveBeenLastCalledWith('hi');
  });

  it('holds the value its owner gives it when controlled', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('');
      return <Textarea placeholder="Notes" value={value} onChangeText={setValue} />;
    }
    await render(<Controlled />);

    await user.type(screen.getByPlaceholderText('Notes'), 'ab');

    expect(screen.getByDisplayValue('ab')).toBeOnTheScreen();
  });

  it('ignores input while not editable and fades with the disabled opacity', async () => {
    const onChangeText = jest.fn();
    const user = userEvent.setup();
    await render(<Textarea placeholder="Notes" editable={false} onChangeText={onChangeText} />);

    const field = screen.getByPlaceholderText('Notes');
    await user.type(field, 'hi');

    expect(onChangeText).not.toHaveBeenCalled();
    expect(field).toBeDisabled();
    expect(field.props.style.opacity).toBe(INTERACTION_TOKENS.disabledOpacity);
  });

  it('forwards its ref to the text input', async () => {
    const ref = createRef<TextInputInstance>();
    await render(<Textarea ref={ref} placeholder="Notes" />);
    expect(ref.current).not.toBeNull();
  });
});
