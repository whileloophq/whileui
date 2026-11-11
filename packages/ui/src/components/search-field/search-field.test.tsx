import { useState } from 'react';
import { fireEvent, render, screen } from '../../test/render';
import { SearchField } from './search-field';

function Search() {
  const [value, setValue] = useState('');
  return <SearchField value={value} onChangeText={setValue} placeholder="Search groups" />;
}

describe('SearchField', () => {
  it('is a search box with a clear button that appears once there is text', async () => {
    await render(<Search />);
    const field = screen.getByLabelText('Search groups');
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();

    await fireEvent.changeText(field, 'kyoto');
    await fireEvent.press(screen.getByRole('button', { name: 'Clear search' }));

    expect(field.props.value).toBe('');
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });
});
