import { Text } from 'react-native';
import { render, screen } from '../../test/render';
import { KeyboardAwareScreen } from './keyboard-aware-screen';

/**
 * This component exists to pick one `KeyboardAvoidingView` prop per platform, and that
 * prop is not observable from a test: `KeyboardAvoidingView` consumes it instead of
 * forwarding it to a host view, and RNTL v14 can only query host elements. Whether the
 * keyboard is actually avoided is a device question anyway.
 *
 * So the real contract here is covered by the native E2E gate, not by this file. What
 * remains unit-testable is that the screen renders and stays transparent to props.
 */
describe('KeyboardAwareScreen', () => {
  it('renders the screen it wraps', async () => {
    await render(
      <KeyboardAwareScreen>
        <Text>Screen body</Text>
      </KeyboardAwareScreen>
    );
    expect(screen.getByText('Screen body')).toBeOnTheScreen();
  });

  it('passes props through to the underlying view', async () => {
    await render(<KeyboardAwareScreen testID="screen" accessibilityLabel="Compose" />);
    expect(screen.getByTestId('screen')).toBeOnTheScreen();
    expect(screen.getByLabelText('Compose')).toBeOnTheScreen();
  });
});
