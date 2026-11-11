import { AccessibilityInfo, Platform, Pressable, StyleSheet } from 'react-native';
import { act, fireEvent, render, screen, TEST_METRICS } from '../../test/render';
import { ToastContainer, ToastProvider, useToast } from './toast';

function ToastHarness() {
  const { toast } = useToast();
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="First toast"
        onPress={() => toast({ title: 'First', duration: 4000 })}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Second toast"
        onPress={() => toast({ title: 'Second', duration: 4000 })}
      />
      <ToastContainer />
    </>
  );
}

describe('ToastProvider', () => {
  afterEach(() => jest.useRealTimers());

  it('does not restart an existing toast timer when another toast appears', async () => {
    jest.useFakeTimers();
    await render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>
    );

    await fireEvent.press(screen.getByRole('button', { name: 'First toast' }));
    await act(() => jest.advanceTimersByTime(2000));
    await fireEvent.press(screen.getByRole('button', { name: 'Second toast' }));
    await act(() => jest.advanceTimersByTime(2001));

    expect(screen.queryByText('First')).toBeNull();
    expect(screen.getByText('Second')).toBeOnTheScreen();
  });

  it('announces a toast without moving focus and names its dismiss control', async () => {
    function Notify() {
      const { toast } = useToast();
      return (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notify"
            onPress={() => toast({ title: 'Saved', description: 'All changes stored.' })}
          />
          <ToastContainer />
        </>
      );
    }
    await render(
      <ToastProvider>
        <Notify />
      </ToastProvider>
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Notify' }));

    // The toast stays a non-accessible container so its buttons remain reachable on
    // iOS, which rules out a role query; read the region's props from its text instead.
    let notice = screen.getByText('All changes stored.').parent;
    while (notice && notice.props.accessibilityRole !== 'alert') notice = notice.parent;
    expect(notice?.props.accessibilityLiveRegion).toBe('polite');

    await fireEvent.press(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('All changes stored.')).toBeNull();
  });

  it('announces a toast on iOS, which has no live regions', async () => {
    const original = Platform.OS;
    Platform.OS = 'ios';
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    try {
      function Notify() {
        const { toast } = useToast();
        return (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notify"
              onPress={() => toast({ title: 'Saved', description: 'All changes stored.' })}
            />
            <ToastContainer />
          </>
        );
      }
      await render(
        <ToastProvider>
          <Notify />
        </ToastProvider>
      );
      await fireEvent.press(screen.getByRole('button', { name: 'Notify' }));

      expect(announce).toHaveBeenCalledTimes(1);
      expect(announce).toHaveBeenCalledWith('Saved. All changes stored.');
    } finally {
      Platform.OS = original;
      announce.mockRestore();
    }
  });
});

describe('ToastContainer', () => {
  it('clears the safe area at the edge it sits on', async () => {
    const { rerender } = await render(
      <ToastProvider>
        <ToastContainer testID="toasts" position="top" />
      </ToastProvider>
    );
    const style = () => StyleSheet.flatten(screen.getByTestId('toasts').props.style);
    expect(style().paddingTop).toBe(TEST_METRICS.insets.top + 8);

    await rerender(
      <ToastProvider>
        <ToastContainer testID="toasts" position="bottom" />
      </ToastProvider>
    );
    expect(style().paddingBottom).toBe(TEST_METRICS.insets.bottom + 8);
  });
});
