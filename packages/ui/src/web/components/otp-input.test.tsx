import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { OTPInput } from './otp-input';

// These are the four things that were broken when the field was first written:
// with the code full, typing did nothing, Backspace did nothing, clicking a
// cell put the caret mid-string, and clearing was impossible. Each has a case.

function Controlled({ length = 6 }: { length?: number }) {
  const [value, setValue] = useState('');
  return (
    <>
      <OTPInput length={length} value={value} onValueChange={setValue} />
      <output data-testid="value">{value}</output>
    </>
  );
}

const field = () => screen.getByLabelText(/verification code/i);
const value = () => screen.getByTestId('value').textContent;

describe('OTPInput', () => {
  it('takes six digits and reports them', async () => {
    const user = userEvent.setup();
    render(<Controlled />);

    await user.click(field());
    await user.keyboard('123456');

    expect(value()).toBe('123456');
  });

  it('ignores a seventh digit rather than replacing the sixth', async () => {
    const user = userEvent.setup();
    render(<Controlled />);

    await user.click(field());
    await user.keyboard('1234567');

    expect(value()).toBe('123456');
  });

  it('deletes from the end however the caret got there', async () => {
    const user = userEvent.setup();
    render(<Controlled />);

    await user.click(field());
    await user.keyboard('123456');
    // A click lands the caret mid-string; deleting must still take the last digit.
    await user.click(field());
    await user.keyboard('{Backspace}');

    expect(value()).toBe('12345');

    await user.keyboard('9');
    expect(value()).toBe('123459');
  });

  it('clears completely and accepts a new code', async () => {
    const user = userEvent.setup();
    render(<Controlled />);

    await user.click(field());
    await user.keyboard('123456');
    await user.keyboard('{Backspace>6/}');

    expect(value()).toBe('');

    await user.keyboard('654321');
    expect(value()).toBe('654321');
  });

  it('keeps the caret at the end so the next keystroke appends', async () => {
    const user = userEvent.setup();
    render(<Controlled />);

    await user.click(field());
    await user.keyboard('123');
    await user.keyboard('{ArrowLeft}{ArrowLeft}4');

    expect(value()).toBe('1234');
  });

  it('takes a pasted code and drops the rest', async () => {
    const user = userEvent.setup();
    render(<Controlled />);

    await user.click(field());
    await user.paste('12-34-56-78');

    expect(value()).toBe('123456');
  });

  it('renders one cell per digit and shows what was typed', async () => {
    const user = userEvent.setup();
    render(<Controlled length={4} />);

    await user.click(field());
    await user.keyboard('42');

    expect(screen.getByText('4')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
  });

  it('refuses input when disabled', async () => {
    const user = userEvent.setup();
    render(<OTPInput disabled />);

    await user.click(field());
    await user.keyboard('123456');

    expect((field() as HTMLInputElement).value).toBe('');
  });
});
