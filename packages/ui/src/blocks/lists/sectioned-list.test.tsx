import { Text } from 'react-native';
import { render, screen } from '../../test/render';
import { SectionedList } from './sectioned-list';

const ITEMS = [
  { id: 'a', month: 'November 2026', name: 'Ramen' },
  { id: 'b', month: 'November 2026', name: 'Train' },
  { id: 'c', month: 'October 2026', name: 'Hotel' },
];

function List({ items }: { items: typeof ITEMS }) {
  return (
    <SectionedList
      items={items}
      sectionOf={(item) => item.month}
      keyOf={(item) => item.id}
      renderItem={(item) => <Text>{item.name}</Text>}
    />
  );
}

describe('SectionedList', () => {
  it('heads each section, in order, with a header a screen reader can jump between', async () => {
    await render(<List items={ITEMS} />);

    const headings = screen.getAllByRole('header');
    expect(headings.map((heading) => heading.props.children)).toEqual([
      'November 2026',
      'October 2026',
    ]);
    for (const name of ['Ramen', 'Train', 'Hotel']) {
      expect(screen.getByText(name)).toBeOnTheScreen();
    }
  });

  it('draws no heading when every item is in one section', async () => {
    await render(<List items={ITEMS.slice(0, 2)} />);
    expect(screen.queryAllByRole('header')).toHaveLength(0);
  });
});
