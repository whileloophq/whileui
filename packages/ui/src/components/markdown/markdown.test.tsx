import { render, screen, userEvent } from '../../test/render';
import { Markdown } from './markdown';

describe('Markdown', () => {
  it('renders structured assistant content through the optional renderer', async () => {
    await render(<Markdown>{'# Result\n\n- first\n- second\n\n`const answer = 42`'}</Markdown>);

    expect(screen.getByText('Result')).toBeOnTheScreen();
    expect(screen.getByText('first')).toBeOnTheScreen();
    expect(screen.getByText('const answer = 42')).toBeOnTheScreen();
  });

  it('delegates links to the application', async () => {
    const onLinkPress = jest.fn();
    const user = userEvent.setup();
    await render(<Markdown onLinkPress={onLinkPress}>{'[Docs](https://example.com)'}</Markdown>);

    await user.press(screen.getByRole('link', { name: 'Docs' }));

    expect(onLinkPress).toHaveBeenCalledWith('https://example.com');
  });
});
