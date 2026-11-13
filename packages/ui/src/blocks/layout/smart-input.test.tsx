import { AccessibilityInfo, StyleSheet, Text } from 'react-native';
import { act, render, screen, userEvent } from '../../test/render';
import { SmartInput } from './smart-input';

const EXAMPLES = ['log a workout', 'add a note'] as const;

describe('SmartInput', () => {
  it('renders an explicit placeholder as given', async () => {
    await render(<SmartInput placeholder="Ask anything" placeholderExamples={EXAMPLES} />);
    expect(screen.getByPlaceholderText('Ask anything')).toBeOnTheScreen();
  });

  it('renders its slots', async () => {
    await render(
      <SmartInput
        placeholder="Ask"
        leftSlot={<Text>left</Text>}
        centerSlot={<Text>center</Text>}
        rightSlot={<Text>right</Text>}
      />
    );
    expect(screen.getByText('left')).toBeOnTheScreen();
    expect(screen.getByText('center')).toBeOnTheScreen();
    expect(screen.getByText('right')).toBeOnTheScreen();
  });

  // A card's text used to start a row gap, a slot's padding and a field's padding past the
  // slot — 36pt from the glyph — and one line sat above the slots' centre line.
  it('starts a card’s text beside its slots, centred on them', async () => {
    await render(
      <SmartInput
        variant="card"
        placeholder="Ask"
        leftSlot={<Text>left</Text>}
        rightSlot={<Text>right</Text>}
      />
    );
    const style = StyleSheet.flatten(screen.getByPlaceholderText('Ask').props.style) as {
      paddingLeft: number;
      paddingRight: number;
      paddingVertical: number;
      lineHeight: number;
      minHeight: number;
    };

    expect(style.paddingLeft).toBeLessThanOrEqual(4);
    expect(style.paddingRight).toBeLessThanOrEqual(4);
    expect(style.lineHeight + 2 * style.paddingVertical).toBe(style.minHeight);
  });

  it('reports what is typed', async () => {
    const onChangeText = jest.fn();
    const user = userEvent.setup();
    await render(<SmartInput placeholder="Ask" onChangeText={onChangeText} />);

    await user.type(screen.getByPlaceholderText('Ask'), 'hi');

    expect(onChangeText).toHaveBeenLastCalledWith('hi');
  });

  describe('rotating placeholder', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('types an example out over time when no placeholder is given', async () => {
      await render(<SmartInput placeholderExamples={EXAMPLES} placeholderPrefix="Try: " />);

      // Nothing typed yet, so the field starts with the prefix only.
      expect(screen.getByPlaceholderText('Try: ')).toBeOnTheScreen();

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      expect(screen.getByPlaceholderText(/^Try: l/)).toBeOnTheScreen();
    });

    it('shows a complete example immediately when reduced motion is on', async () => {
      jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);

      await render(<SmartInput placeholderExamples={EXAMPLES} placeholderPrefix="Try: " />);
      await act(async () => {});

      expect(screen.getByPlaceholderText('Try: log a workout')).toBeOnTheScreen();
    });

    it('stops its timer when unmounted', async () => {
      const clearInterval = jest.spyOn(global, 'clearInterval');
      const { unmount } = await render(<SmartInput placeholderExamples={EXAMPLES} />);

      await unmount();

      expect(clearInterval).toHaveBeenCalled();
      clearInterval.mockRestore();
    });
  });
});
