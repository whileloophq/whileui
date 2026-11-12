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

  it('is a button with a focus ring and a web target when it has a handler', async () => {
    await render(
      <Pressable accessibilityLabel="Save" onPress={jest.fn()}>
        <Text>Save</Text>
      </Pressable>
    );
    const control = screen.getByRole('button', { name: 'Save' });
    expect(control.props.className).toContain('web:focus-visible:ring-2');
    expect(control.props.className).toContain('web:min-h-6');
  });

  it('is plain content without a handler', async () => {
    await render(
      <Pressable testID="row" className="p-4">
        <Text>Groceries</Text>
      </Pressable>
    );
    expect(screen.queryByRole('button')).toBeNull();
    const row = screen.getByTestId('row');
    expect(row.props.className).toBe('p-4');
    expect(row.props.accessibilityRole).toBeUndefined();
  });

  it('keeps an explicit role, and an inset ring when asked', async () => {
    await render(
      <Pressable role="tab" aria-selected focusIndicator="inset" onPress={jest.fn()}>
        <Text>Week</Text>
      </Pressable>
    );
    const tab = screen.getByRole('tab', { name: 'Week' });
    expect(tab).toBeSelected();
    expect(tab.props.className).not.toContain('ring-offset');
  });

  it('lets the caller override the web target', async () => {
    await render(
      <Pressable accessibilityLabel="Inline" className="web:min-h-0" onPress={jest.fn()} />
    );
    const control = screen.getByRole('button', { name: 'Inline' });
    expect(control.props.className).toContain('web:min-h-0');
    expect(control.props.className).not.toContain('web:min-h-6');
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
