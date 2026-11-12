import { render, screen } from '../../test/render';
import { Card, CardDescription, CardHeader, CardTitle } from './card';

describe('CardTitle', () => {
  it('is a heading, so a screen reader can move between cards by title', async () => {
    await render(
      <Card>
        <CardHeader>
          <CardTitle>People</CardTitle>
          <CardDescription>Who is in this group.</CardDescription>
        </CardHeader>
      </Card>
    );
    expect(screen.getByRole('header', { name: 'People' })).toBeOnTheScreen();
  });
});
