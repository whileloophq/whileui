import { fireEvent, render, screen } from '../../test/render';
import { Button, ButtonText } from '../button';
import { Text } from '../text';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

function Menu({ onSettings }: { onSettings: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <ButtonText>Menu</ButtonText>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onPress={onSettings}>
          <Text>Settings</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('runs the item and closes, also when the item has its own onPress', async () => {
    const onSettings = jest.fn();
    await render(<Menu onSettings={onSettings} />);

    const trigger = screen.getByRole('button', { name: 'Menu' });
    expect(trigger).toBeCollapsed();
    await fireEvent.press(trigger);
    expect(trigger).toBeExpanded();

    await fireEvent.press(screen.getByRole('menuitem', { name: 'Settings' }));
    expect(onSettings).toHaveBeenCalledTimes(1);
    // Every menu once spread the caller's props after its own onPress, so an item with a
    // handler — every real one — left the menu open.
    expect(screen.queryByRole('menuitem', { name: 'Settings' })).toBeNull();
    expect(trigger).toBeCollapsed();
  });
});
