import { useState } from 'react';
import { fireEvent, render, screen, userEvent } from '../../test/render';
import { OTPInput } from './otp-input';

const label = (length = 6) => `Enter ${length}-digit verification code`;

describe('OTPInput', () => {
  it('names itself for assistive technology, including its length', async () => {
    await render(<OTPInput length={4} />);
    expect(screen.getByLabelText(label(4))).toBeOnTheScreen();
  });

  it('renders the digits it has been given', async () => {
    await render(<OTPInput value="123" />);
    expect(screen.getByText('1')).toBeOnTheScreen();
    expect(screen.getByText('2')).toBeOnTheScreen();
    expect(screen.getByText('3')).toBeOnTheScreen();
  });

  it('masks digits when secure', async () => {
    await render(<OTPInput value="12" secure />);
    expect(screen.queryByText('1')).not.toBeOnTheScreen();
    expect(screen.getAllByText('●')).toHaveLength(2);
  });

  it('reports the code as it is typed', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    await render(<OTPInput onValueChange={onValueChange} />);

    await user.type(screen.getByLabelText(label()), '12');

    expect(onValueChange).toHaveBeenLastCalledWith('12');
  });

  it('discards non-digit characters', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    await render(<OTPInput onValueChange={onValueChange} />);

    await user.type(screen.getByLabelText(label()), '1a2');

    expect(onValueChange).toHaveBeenLastCalledWith('12');
  });

  it('truncates a pasted code longer than its length', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    await render(<OTPInput length={4} onValueChange={onValueChange} />);

    await user.paste(screen.getByLabelText(label(4)), '1234567');

    expect(onValueChange).toHaveBeenLastCalledWith('1234');
  });

  it('calls onComplete once the last digit arrives', async () => {
    const onComplete = jest.fn();
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('');
      return <OTPInput length={4} value={value} onValueChange={setValue} onComplete={onComplete} />;
    }
    await render(<Controlled />);

    await user.type(screen.getByLabelText(label(4)), '123');
    expect(onComplete).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(label(4)), '4');
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('stays editable after being filled, so a wrong code can be corrected', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <OTPInput
          length={4}
          value={value}
          onValueChange={(next) => {
            setValue(next);
            onValueChange(next);
          }}
        />
      );
    }
    await render(<Controlled />);
    const field = screen.getByLabelText(label(4));

    await user.type(field, '1234');
    await user.clear(field);

    expect(onValueChange).toHaveBeenLastCalledWith('');
  });

  it('ignores input while disabled', async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    await render(<OTPInput disabled onValueChange={onValueChange} />);

    await user.type(screen.getByLabelText(label()), '12');

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('stops its cursor timer when unmounted', async () => {
    const clearInterval = jest.spyOn(global, 'clearInterval');
    const { unmount } = await render(<OTPInput />);

    // The blinking cursor only exists while focused, so nothing needs cleaning up
    // until then.
    await fireEvent(screen.getByLabelText(label()), 'focus');
    await unmount();

    expect(clearInterval).toHaveBeenCalled();
    clearInterval.mockRestore();
  });
});
