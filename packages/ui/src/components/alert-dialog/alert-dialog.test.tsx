import React from 'react';
import { render, screen, userEvent } from '../../test/render';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
import { ButtonText } from '../button/button';

function Example(props: Omit<React.ComponentProps<typeof AlertDialog>, 'children'>) {
  return (
    <AlertDialog {...props}>
      <AlertDialogTrigger>
        <ButtonText>Delete</ButtonText>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe('AlertDialog', () => {
  it('stays closed until asked to open', async () => {
    await render(<Example />);
    expect(screen.queryByText('Delete this item?')).not.toBeOnTheScreen();
  });

  it('opens from its trigger', async () => {
    const user = userEvent.setup();
    await render(<Example />);

    await user.press(screen.getByText('Delete'));

    expect(screen.getByText('Delete this item?')).toBeOnTheScreen();
    expect(screen.getByText('This cannot be undone.')).toBeOnTheScreen();
  });

  it('renders open when its owner says so', async () => {
    await render(<Example open />);
    expect(screen.getByText('Delete this item?')).toBeOnTheScreen();
  });

  it('tells its owner when it wants to close, and does not close itself', async () => {
    const onOpenChange = jest.fn();
    const user = userEvent.setup();
    await render(<Example open onOpenChange={onOpenChange} />);

    await user.press(screen.getByText('Keep'));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    // Controlled: the owner holds `open`, so the dialog must still be on screen.
    expect(screen.getByText('Delete this item?')).toBeOnTheScreen();
  });

  it('closes itself when uncontrolled', async () => {
    const user = userEvent.setup();
    await render(<Example defaultOpen />);

    await user.press(screen.getByText('Keep'));

    expect(screen.queryByText('Delete this item?')).not.toBeOnTheScreen();
  });

  it('runs the action handler and closes', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
          <AlertDialogAction onPress={onPress}>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.press(screen.getByText('Delete'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Delete this item?')).not.toBeOnTheScreen();
  });

  // Regression: neither control set an `accessibilityRole`, so both buttons in a
  // destructive confirmation announced as plain views.
  //
  // The related fix — `accessible={false}` on the backdrop and the panel, so iOS stops
  // collapsing the whole dialog into one accessibility element — is deliberately not
  // asserted here. RNTL walks the React tree and finds descendants regardless of an
  // ancestor's `accessible` prop, so this layer cannot tell the two states apart. That
  // one is a native E2E gate.
  it('announces its buttons as buttons', async () => {
    await render(<Example open />);

    expect(screen.getByRole('button', { name: 'Keep' })).toBeOnTheScreen();
    // Two: the trigger and the confirm action. The trigger only became a button in the
    // same sweep, so one match here would mean one of them had regressed.
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(2);
  });

  it('marks its title as a header so assistive technology can land on it', async () => {
    await render(<Example open />);
    expect(screen.getByRole('header')).toHaveTextContent('Delete this item?');
  });
});
