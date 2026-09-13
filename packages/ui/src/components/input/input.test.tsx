import { createRef, useState } from 'react';
import { Text, type TextInput } from 'react-native';
import { render, screen, userEvent } from '../../test/render';
import { Input } from './input';

describe('Input', () => {
  it('renders its placeholder', async () => {
    await render(<Input placeholder="Email" />);
    expect(screen.getByPlaceholderText('Email')).toBeOnTheScreen();
  });

  it('reports each keystroke to onChangeText', async () => {
    const onChangeText = jest.fn();
    const user = userEvent.setup();
    await render(<Input placeholder="Email" onChangeText={onChangeText} />);

    await user.type(screen.getByPlaceholderText('Email'), 'hi');

    expect(onChangeText).toHaveBeenLastCalledWith('hi');
  });

  it('holds the value its owner gives it when controlled', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('');
      return <Input placeholder="Email" value={value} onChangeText={setValue} />;
    }
    await render(<Controlled />);

    await user.type(screen.getByPlaceholderText('Email'), 'ab');

    expect(screen.getByDisplayValue('ab')).toBeOnTheScreen();
  });

  it('ignores input while not editable', async () => {
    const onChangeText = jest.fn();
    const user = userEvent.setup();
    await render(<Input placeholder="Email" editable={false} onChangeText={onChangeText} />);

    await user.type(screen.getByPlaceholderText('Email'), 'hi');

    expect(onChangeText).not.toHaveBeenCalled();
  });

  it('reports its disabled state to assistive technology while not editable', async () => {
    await render(<Input placeholder="Email" editable={false} />);
    expect(screen.getByPlaceholderText('Email')).toBeDisabled();
  });

  it('renders prefix and suffix content', async () => {
    await render(<Input placeholder="Amount" prefix={<Text>$</Text>} suffix={<Text>USD</Text>} />);
    expect(screen.getByText('$')).toBeOnTheScreen();
    expect(screen.getByText('USD')).toBeOnTheScreen();
  });

  it('forwards its ref to the text input', async () => {
    const ref = createRef<TextInput>();
    await render(<Input ref={ref} placeholder="Email" />);
    expect(ref.current).not.toBeNull();
  });
});
