import { StyleSheet, Text } from 'react-native';
import { fireEvent, render, screen } from '../../test/render';
import { FAB, FABGroup, fabClearance } from './fab';

describe('FAB', () => {
  it('announces its label, because the glyph carries no name', async () => {
    await render(
      <FAB label="New group">
        <Text>+</Text>
      </FAB>
    );
    expect(screen.getByRole('button', { name: 'New group' })).toBeTruthy();
  });

  it('calls onPress', async () => {
    const onPress = jest.fn();
    await render(
      <FAB label="Add" onPress={onPress}>
        <Text>+</Text>
      </FAB>
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Add' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire while disabled', async () => {
    const onPress = jest.fn();
    await render(
      <FAB label="Add" disabled onPress={onPress}>
        <Text>+</Text>
      </FAB>
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Add' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('keeps a caller style function working alongside its shadow', async () => {
    // A Pressable style may be a function of press state. Dropping it into a style
    // array silently discards it, which is the defect `select.tsx` documents.
    const style = jest.fn(() => ({ opacity: 1 }));
    await render(
      <FAB label="Add" style={style}>
        <Text>+</Text>
      </FAB>
    );
    expect(style).toHaveBeenCalled();
  });
});

describe('FAB placement', () => {
  const placed = (name: string) =>
    StyleSheet.flatten(screen.getByRole('button', { name }).props.style);

  it('floats 24pt from the bottom-right corner by default', async () => {
    await render(<FAB label="Add" />);
    expect(placed('Add')).toMatchObject({ position: 'absolute', bottom: 24, right: 24 });
  });

  it('clears the home indicator and screen corner with safeArea', async () => {
    // TEST_METRICS has a 34pt bottom inset, as an iPhone with a home indicator does.
    await render(<FAB label="Add" safeArea />);
    expect(placed('Add')).toMatchObject({ position: 'absolute', bottom: 24 + 34, right: 24 });
  });

  it('lays out inline inside a FABGroup, so the group places it once', async () => {
    // Floating inside a floating group offset it twice: the main FAB landed up and to
    // the left of the small one and covered it.
    await render(
      <FABGroup safeArea>
        <FAB label="More" size="sm" />
        <FAB label="Add" />
      </FABGroup>
    );
    expect(placed('Add').position).toBeUndefined();
    expect(placed('More').position).toBeUndefined();
    const group = screen.getByRole('button', { name: 'Add' }).parent;
    expect(StyleSheet.flatten(group?.props.style)).toMatchObject({ bottom: 24 + 34, right: 24 });
  });
});

describe('fabClearance', () => {
  it('clears the floating inset, the FAB itself and a gap', () => {
    expect(fabClearance()).toBe(24 + 56 + 16);
    expect(fabClearance('sm')).toBe(24 + 48 + 16);
    expect(fabClearance('lg')).toBe(24 + 64 + 16);
  });

  it('adds the bottom inset a safeArea FAB is lifted by', () => {
    expect(fabClearance('default', 34)).toBe(24 + 56 + 16 + 34);
  });
});
