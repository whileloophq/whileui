import { Text } from 'react-native';
import { fireEvent, render, screen } from '../../test/render';
import { FAB } from './fab';

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
