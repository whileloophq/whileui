import { useState } from 'react';
import { render, screen } from '../../test/render';
import { SelectField } from './select-field';

const GROUPS = [
  { value: '', label: 'Just for me' },
  { value: 'kyoto', label: 'Weekend in Kyoto' },
];

function Group({ onChange }: { onChange: (value: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <SelectField
      label="Group"
      value={value}
      options={GROUPS}
      onValueChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

describe('SelectField', () => {
  it('names the trigger by its label and current choice, empty value included', async () => {
    await render(<Group onChange={jest.fn()} />);

    expect(screen.getByText('Group')).toBeOnTheScreen();
    expect(screen.getByRole('combobox', { name: 'Group, Just for me' })).toBeOnTheScreen();
  });

  it('shows a non-empty choice the same way', async () => {
    // Opening the list needs a measured trigger, which jest cannot give; choosing an
    // option is checked in the browser against the catalog demo.
    await render(
      <SelectField label="Group" value="kyoto" options={GROUPS} onValueChange={jest.fn()} />
    );
    expect(screen.getByRole('combobox', { name: 'Group, Weekend in Kyoto' })).toBeOnTheScreen();
  });
});
