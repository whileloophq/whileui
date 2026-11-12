import { fireEvent, render, screen } from '../../test/render';
import { RadioGroup, RadioGroupItem } from './radio-group';

describe('RadioGroup', () => {
  it('is a radio group whose labelled items are one radio each', async () => {
    const onValueChange = jest.fn();
    await render(
      <RadioGroup defaultValue="free" onValueChange={onValueChange}>
        <RadioGroupItem value="free" label="Free plan" />
        <RadioGroupItem value="pro" label="Pro plan" description="Billed monthly" />
      </RadioGroup>
    );

    const free = screen.getByRole('radio', { name: 'Free plan' });
    expect(free.parent?.props.role).toBe('radiogroup');
    expect(free).toBeChecked();

    await fireEvent.press(screen.getByRole('radio', { name: /Pro plan/ }));
    expect(onValueChange).toHaveBeenCalledWith('pro');
    expect(screen.getByRole('radio', { name: /Pro plan/ })).toBeChecked();
    expect(free).not.toBeChecked();
  });

  it('does not select a disabled item', async () => {
    const onValueChange = jest.fn();
    await render(
      <RadioGroup defaultValue="free" onValueChange={onValueChange}>
        <RadioGroupItem value="free" label="Free plan" />
        <RadioGroupItem value="team" label="Team plan" disabled />
      </RadioGroup>
    );

    const team = screen.getByRole('radio', { name: 'Team plan' });
    expect(team).toBeDisabled();
    await fireEvent.press(team);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
