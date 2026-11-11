import { Pressable } from 'react-native';
import { act, fireEvent, render, screen, waitFor } from '../test/render';
import { useThemeBridge, type ThemeBridgeAdapter, type ThemeMode } from './theme-bridge';

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((next) => {
    resolve = next;
  });
  return { promise, resolve };
}

function ThemeHarness({ adapter }: { adapter: ThemeBridgeAdapter }) {
  const { setMode } = useThemeBridge({ adapter, initialMode: 'system' });
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Use dark"
      onPress={() => setMode('dark')}
    />
  );
}

function ToggleHarness({ adapter }: { adapter: ThemeBridgeAdapter }) {
  const { resolvedTheme, toggleTheme } = useThemeBridge({ adapter, initialMode: 'system' });
  const next = resolvedTheme === 'dark' ? 'light' : 'dark';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${next} theme`}
      onPress={toggleTheme}
    />
  );
}

describe('useThemeBridge', () => {
  it('loads a replacement adapter before saving anything into it', async () => {
    const first: ThemeBridgeAdapter = {
      loadThemeMode: jest.fn(async (): Promise<ThemeMode> => 'light'),
      saveThemeMode: jest.fn(async () => undefined),
    };
    const nextMode = deferred<ThemeMode>();
    const second: ThemeBridgeAdapter = {
      loadThemeMode: jest.fn(() => nextMode.promise),
      saveThemeMode: jest.fn(async () => undefined),
    };
    const result = await render(<ThemeHarness adapter={first} />);
    await waitFor(() => expect(first.saveThemeMode).toHaveBeenCalledWith('light'));

    await result.rerender(<ThemeHarness adapter={second} />);

    expect(second.loadThemeMode).toHaveBeenCalledTimes(1);
    expect(second.saveThemeMode).not.toHaveBeenCalled();

    await act(async () => nextMode.resolve('dark'));
    await waitFor(() => expect(second.saveThemeMode).toHaveBeenCalledWith('dark'));
  });

  it('keeps a user choice made while storage is still loading', async () => {
    const persistedMode = deferred<ThemeMode>();
    const adapter: ThemeBridgeAdapter = {
      loadThemeMode: jest.fn(() => persistedMode.promise),
      saveThemeMode: jest.fn(async () => undefined),
    };
    await render(<ThemeHarness adapter={adapter} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Use dark' }));
    await waitFor(() => expect(adapter.saveThemeMode).toHaveBeenCalledWith('dark'));

    await act(async () => persistedMode.resolve('light'));
    expect(adapter.saveThemeMode).not.toHaveBeenCalledWith('light');
  });

  it('flips the theme on screen with one press, starting from system', async () => {
    const adapter: ThemeBridgeAdapter = {
      loadThemeMode: jest.fn(async (): Promise<ThemeMode> => 'system'),
      saveThemeMode: jest.fn(async () => undefined),
    };
    await render(<ToggleHarness adapter={adapter} />);
    await waitFor(() => expect(adapter.saveThemeMode).toHaveBeenCalledWith('system'));

    await fireEvent.press(screen.getByRole('button', { name: 'Switch to dark theme' }));
    await waitFor(() => expect(adapter.saveThemeMode).toHaveBeenLastCalledWith('dark'));

    await fireEvent.press(screen.getByRole('button', { name: 'Switch to light theme' }));
    await waitFor(() => expect(adapter.saveThemeMode).toHaveBeenLastCalledWith('light'));
  });
});
