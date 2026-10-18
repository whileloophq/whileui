import { useState } from 'react';
import { render, screen, userEvent } from '../../test/render';
import { Switch } from './switch';

describe('Switch', () => {
  it('exposes a switch that starts off', async () => {
    await render(<Switch />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('toggles and reports the next value when pressed', async () => {
    const onCheckedChange = jest.fn();
    const user = userEvent.setup();
    await render(<Switch onCheckedChange={onCheckedChange} />);

    await user.press(screen.getByRole('switch'));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('stays on the value its owner gives it', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return <Switch checked={checked} onCheckedChange={setChecked} />;
    }
    await render(<Controlled />);

    await user.press(screen.getByRole('switch'));

    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('does not toggle while disabled', async () => {
    const onCheckedChange = jest.fn();
    const user = userEvent.setup();
    await render(<Switch disabled onCheckedChange={onCheckedChange} />);

    await user.press(screen.getByRole('switch'));

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('switch')).toBeDisabled();
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('starts from defaultChecked', async () => {
    await render(<Switch defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });
});
