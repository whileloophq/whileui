import { fireEvent, render, screen } from '../../test/render';
import { Pagination } from './pagination';

describe('Pagination', () => {
  it('pages forward and back, and disables the ends', async () => {
    const onPageChange = jest.fn();
    await render(
      <Pagination page={1} totalPages={4} totalItems={83} onPageChange={onPageChange} />
    );

    expect(screen.getByText('83 total')).toBeOnTheScreen();
    expect(screen.getByText('Page 1 of 4')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();

    await fireEvent.press(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('draws nothing for a single page', async () => {
    await render(<Pagination page={1} totalPages={1} onPageChange={jest.fn()} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
