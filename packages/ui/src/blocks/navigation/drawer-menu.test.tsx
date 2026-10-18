import { I18nManager } from 'react-native';
import { act, fireEvent, render, screen } from '../../test/render';
import { DrawerMenu } from './drawer-menu';

const sections = [{ items: [{ key: 'history', label: 'History' }] }];

type Rendered = Awaited<ReturnType<typeof render>>;

/** The panel is the one animated view whose style carries a transform. */
function panelTranslateX(result: Rendered) {
  const [panel] = result.root!.queryAll((instance) => {
    const className = instance.props.className as unknown;
    return (
      typeof instance.type === 'string' &&
      typeof className === 'string' &&
      className.includes('relative overflow-hidden')
    );
  });
  if (!panel) {
    throw new Error('Drawer panel has no animated transform');
  }
  const style = panel.props.style as Array<{ transform?: { translateX?: unknown }[] }>;
  const transform = style.find((entry) => entry?.transform)?.transform;
  if (!transform) {
    throw new Error('Drawer panel has no translate transform');
  }
  const translate = transform[0];
  if (typeof translate.translateX !== 'number') {
    throw new Error('Drawer panel has no numeric translateX');
  }
  return translate.translateX;
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
    await act(() => {
      jest.runAllTimers();
    });
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
