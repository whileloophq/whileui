import { Text } from 'react-native';
import { render, screen } from '../../test/render';
import { KeyboardAwareScrollView } from './keyboard-aware-scroll-view';
import { FormModalScreen } from './form-modal-screen';
import { PullToRefreshScrollView } from './pull-to-refresh-scroll-view';
import { SheetContent } from './sheet';

/**
 * Whether the keyboard is avoided is decided natively: the iOS scroll view measures
 * itself in window coordinates when the keyboard frame changes. That is the only
 * measurement that sees where a native sheet sits, and it is a device question. What a
 * test can hold is that every form scroll root asks for it.
 */
describe('keyboard insets on form scroll roots', () => {
  it('KeyboardAwareScrollView asks the native scroll view to clear the keyboard', async () => {
    await render(
      <KeyboardAwareScrollView testID="form">
        <Text>Field</Text>
      </KeyboardAwareScrollView>
    );
    const form = screen.getByTestId('form');
    expect(form.props.automaticallyAdjustKeyboardInsets).toBe(true);
    expect(form.props.keyboardShouldPersistTaps).toBe('handled');
  });

  it('lets a caller opt out', async () => {
    await render(
      <KeyboardAwareScrollView testID="form" automaticallyAdjustKeyboardInsets={false} />
    );
    expect(screen.getByTestId('form').props.automaticallyAdjustKeyboardInsets).toBe(false);
  });

  it('FormModalScreen, SheetContent and PullToRefreshScrollView clear the keyboard too', async () => {
    await render(
      <>
        <FormModalScreen title="Edit">
          <Text>Modal field</Text>
        </FormModalScreen>
        <PullToRefreshScrollView testID="list" refreshing={false} onRefresh={() => {}} />
        <SheetContent testID="sheet-content">
          <Text>Sheet field</Text>
        </SheetContent>
      </>
    );
    expect(screen.getByTestId('sheet-content').props.automaticallyAdjustKeyboardInsets).toBe(true);
    expect(screen.getByTestId('list').props.automaticallyAdjustKeyboardInsets).toBe(true);
    let node = screen.getByText('Modal field').parent;
    while (node && node.type !== 'RCTScrollView') node = node.parent;
    expect(node?.props.automaticallyAdjustKeyboardInsets).toBe(true);
  });
});
