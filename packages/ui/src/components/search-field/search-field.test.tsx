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

describe('the clear cross', () => {
  it('is drawn, not a "×" glyph that each font sets off-centre', async () => {
    await render(<SearchField value="kyoto" onChangeText={jest.fn()} />);
    expect(screen.queryByText('×')).toBeNull();
    expect(screen.getByTestId('cross-glyph', { includeHiddenElements: true })).toBeOnTheScreen();
  });
});

describe('a custom icon', () => {
  it('is decoration, hidden from screen readers like the drawn one', async () => {
    const { Text } = jest.requireActual('react-native');
    await render(<SearchField value="" onChangeText={jest.fn()} icon={<Text>ICON</Text>} />);
    expect(screen.queryByText('ICON')).toBeNull();
    expect(screen.getByText('ICON', { includeHiddenElements: true })).toBeTruthy();
  });
});
