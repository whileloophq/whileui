import { useRef } from 'react';
import { Keyboard } from 'react-native';

type KeyboardListener = Parameters<typeof Keyboard.addListener>[1];
import { fireEvent, render, screen } from '../test/render';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/select';
import { useDismissKeyboardOnOpen } from './dismiss-keyboard-on-open';

const position = { width: 120, height: 44, pageX: 16, pageY: 300 };

function Trigger({ open, onMeasured }: { open: boolean; onMeasured: jest.Mock }) {
  const ref = useRef({
    measure: (callback: (...args: number[]) => void) => callback(0, 0, 120, 44, 16, 300),
  });
  useDismissKeyboardOnOpen(open, ref, onMeasured);
  return null;
}

describe('useDismissKeyboardOnOpen', () => {
  let hide: KeyboardListener | undefined;

  beforeEach(() => {
    hide = undefined;
    jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => {});
    jest.spyOn(Keyboard, 'addListener').mockImplementation((event, listener) => {
      if (event === 'keyboardDidHide') hide = listener;
      return { remove: jest.fn() } as unknown as ReturnType<typeof Keyboard.addListener>;
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it('closes an open keyboard and measures the trigger again once it has gone', async () => {
    jest.spyOn(Keyboard, 'isVisible').mockReturnValue(true);
    const onMeasured = jest.fn();
    await render(<Trigger open onMeasured={onMeasured} />);

    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
    expect(onMeasured).not.toHaveBeenCalled();
    hide?.({} as Parameters<KeyboardListener>[0]);
    expect(onMeasured).toHaveBeenCalledWith(position);
  });

  it('does nothing when no keyboard is up, or while closed', async () => {
    const isVisible = jest.spyOn(Keyboard, 'isVisible').mockReturnValue(false);
    const onMeasured = jest.fn();
    await render(<Trigger open onMeasured={onMeasured} />);
    isVisible.mockReturnValue(true);
    await render(<Trigger open={false} onMeasured={onMeasured} />);

    expect(Keyboard.dismiss).not.toHaveBeenCalled();
    expect(onMeasured).not.toHaveBeenCalled();
  });

  it('runs when a Select opens', async () => {
    jest.spyOn(Keyboard, 'isVisible').mockReturnValue(true);
    await render(
      <Select>
        <SelectTrigger accessibilityLabel="Category">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="food" label="Food" />
        </SelectContent>
      </Select>
    );
    expect(Keyboard.dismiss).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByLabelText('Category'));
    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
  });
});
