import { render, screen, userEvent } from '../../test/render';
import { Pressable } from './pressable';
import { Text } from '../text';

describe('Pressable', () => {
  it('preserves caller handlers and style callbacks', async () => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    const style = jest.fn(() => ({ marginTop: 7 }));
    const user = userEvent.setup();

    await render(
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open"
        feedback="strong"
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={style}
      >
        <Text>Open</Text>
      </Pressable>
    );

    const control = screen.getByRole('button', { name: 'Open' });
    await user.press(control);

    expect(onPressIn).toHaveBeenCalledTimes(1);
    expect(onPressOut).toHaveBeenCalledTimes(1);
    expect(style).toHaveBeenCalled();
  });

  it('treats loading as busy and disabled', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();

    await render(
      <Pressable accessibilityRole="button" accessibilityLabel="Submit" loading onPress={onPress}>
        <Text>Submit</Text>
      </Pressable>
    );

    const control = screen.getByRole('button', { name: 'Submit' });
    expect(control).toBeDisabled();
    expect(control.props.accessibilityState).toMatchObject({ busy: true, disabled: true });
    await user.press(control);
    expect(onPress).not.toHaveBeenCalled();
  });
});
