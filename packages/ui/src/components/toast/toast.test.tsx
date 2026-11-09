import { Pressable } from 'react-native';
import { act, fireEvent, render, screen } from '../../test/render';
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
});
