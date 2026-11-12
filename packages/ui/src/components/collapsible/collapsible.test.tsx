import { fireEvent, render, screen } from '../../test/render';
import { Button, ButtonText } from '../button';
import { Text } from '../text';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

describe('Collapsible', () => {
  it('says whether it is open', async () => {
    await render(
      <Collapsible>
        <CollapsibleTrigger>
          <Text>Details</Text>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Text>Hidden text</Text>
        </CollapsibleContent>
      </Collapsible>
    );
    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger).toBeCollapsed();
    await fireEvent.press(trigger);
    expect(trigger).toBeExpanded();
    expect(screen.getByText('Hidden text')).toBeOnTheScreen();
  });

  it('with asChild, makes the child the trigger instead of wrapping it', async () => {
    await render(
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button>
            <ButtonText>Show</ButtonText>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Text>Hidden text</Text>
        </CollapsibleContent>
      </Collapsible>
    );
    // One button: the trigger once wrapped the Button in a second pressable.
    expect(screen.getAllByRole('button')).toHaveLength(1);
    const trigger = screen.getByRole('button', { name: 'Show' });
    await fireEvent.press(trigger);
    expect(trigger).toBeExpanded();
  });
});
