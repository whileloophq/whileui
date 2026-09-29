import { render, screen } from '../../test/render';
import { DrawerMenu } from './drawer-menu';

describe('DrawerMenu', () => {
  it('keeps navigation items in a scroll owner', async () => {
    const result = await render(
      <DrawerMenu
        visible
        onClose={jest.fn()}
        sections={[{ items: [{ key: 'history', label: 'History' }] }]}
      />
    );

    expect(result.root!.queryAll((instance) => instance.type === 'RCTScrollView')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'History' })).toBeOnTheScreen();
  });
});
