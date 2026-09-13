import { AccessibilityInfo, Text } from 'react-native';
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
