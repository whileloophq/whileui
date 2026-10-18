import { I18nManager } from 'react-native';
import { getAnimatedStyle } from 'react-native-reanimated';
import { act, fireEvent, render, screen } from '../../test/render';
import { DrawerMenu } from './drawer-menu';

const sections = [{ items: [{ key: 'history', label: 'History' }] }];

type Rendered = Awaited<ReturnType<typeof render>>;

/** The panel is the one animated view whose style carries a transform. */
function panelTranslateX(result: Rendered) {
  const [panel] = result.root!.queryAll((instance) => {
    const style = getAnimatedStyle(instance as never) as { transform?: unknown[] } | undefined;
    return Array.isArray(style?.transform);
  });
  const style = getAnimatedStyle(panel as never) as { transform: { translateX: number }[] };
  return style.transform[0].translateX;
}

describe('DrawerMenu', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('keeps navigation items in a scroll owner', async () => {
    const result = await render(<DrawerMenu visible onClose={jest.fn()} sections={sections} />);

    expect(result.root!.queryAll((instance) => instance.type === 'RCTScrollView')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'History' })).toBeOnTheScreen();
  });

  it('exits towards the leading edge, which is the right in RTL', async () => {
    jest.useFakeTimers();
    const ltr = await render(<DrawerMenu visible onClose={jest.fn()} sections={sections} />);
    await ltr.rerender(<DrawerMenu visible={false} onClose={jest.fn()} sections={sections} />);
    expect(panelTranslateX(ltr)).toBeLessThan(0);
    await ltr.unmount();

    jest.replaceProperty(I18nManager, 'isRTL', true);
    const rtl = await render(<DrawerMenu visible onClose={jest.fn()} sections={sections} />);
    await rtl.rerender(<DrawerMenu visible={false} onClose={jest.fn()} sections={sections} />);
    expect(panelTranslateX(rtl)).toBeGreaterThan(0);
  });

  it('cancels a pending exit when reopened, and unmounts cleanly mid-exit', async () => {
    jest.useFakeTimers();
    const result = await render(<DrawerMenu visible onClose={jest.fn()} sections={sections} />);

    await result.rerender(<DrawerMenu visible={false} onClose={jest.fn()} sections={sections} />);
    await result.rerender(<DrawerMenu visible onClose={jest.fn()} sections={sections} />);
    jest.runAllTimers();
    expect(screen.getByRole('button', { name: 'History' })).toBeOnTheScreen();

    await result.rerender(<DrawerMenu visible={false} onClose={jest.fn()} sections={sections} />);
    await result.unmount();
    expect(() => jest.runAllTimers()).not.toThrow();
  });

  it('reports the selection and unmounts once the owner closes it to navigate', async () => {
    jest.useFakeTimers();
    const onSelect = jest.fn();
    const result = await render(
      <DrawerMenu visible onClose={jest.fn()} onSelect={onSelect} sections={sections} />
    );

    const item = screen.getByRole('button', { name: 'History' });
    await fireEvent(item, 'click', { nativeEvent: {} });
    expect(onSelect).toHaveBeenCalledWith('history');

    await result.rerender(
      <DrawerMenu visible={false} onClose={jest.fn()} onSelect={onSelect} sections={sections} />
    );
    await act(() => {
      jest.runAllTimers();
    });
    expect(screen.queryByRole('button', { name: 'History' })).toBeNull();
  });
});
