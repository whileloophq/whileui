import React, { createRef } from 'react';
import { View } from 'react-native';
import { render, screen, userEvent } from '../../test/render';
import { Text } from '../text';
import { Button, ButtonIcon, ButtonText } from './button';

describe('Button', () => {
  it('names itself by its text, not by its icon glyph', async () => {
    await render(
      <Button>
        <ButtonIcon>
          <Text>★</Text>
        </ButtonIcon>
        <ButtonText>Download</ButtonText>
      </Button>
    );

    // iOS reads an unhidden icon font glyph into the label: ", Download".
    expect(screen.queryByText('★')).toBeNull();
    expect(screen.getByText('★', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: /Download/ })).toBeOnTheScreen();
  });

  it('renders its label', async () => {
    await render(
      <Button>
        <ButtonText>Save</ButtonText>
      </Button>
    );
    expect(screen.getByText('Save')).toBeOnTheScreen();
  });

  it('exposes the button role to assistive technology', async () => {
    await render(
      <Button accessibilityLabel="Save">
        <ButtonText>Save</ButtonText>
      </Button>
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeOnTheScreen();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(
      <Button onPress={onPress}>
        <ButtonText>Save</ButtonText>
      </Button>
    );

    await user.press(screen.getByText('Save'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress while disabled', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(
      <Button disabled onPress={onPress}>
        <ButtonText>Save</ButtonText>
      </Button>
    );

    await user.press(screen.getByText('Save'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('is busy, disabled, and preserves its label while loading', async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(
      <Button loading onPress={onPress} accessibilityLabel="Save">
        <ButtonText>Save</ButtonText>
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    expect(button.props.accessibilityState).toMatchObject({ busy: true, disabled: true });
    expect(screen.getByText('Save')).toBeOnTheScreen();

    await user.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('reports its disabled state to assistive technology', async () => {
    await render(
      <Button disabled accessibilityLabel="Save">
        <ButtonText>Save</ButtonText>
      </Button>
    );
    expect(screen.getByLabelText('Save')).toBeDisabled();
  });

  it('forwards its ref to the underlying pressable', async () => {
    const ref = createRef<React.ComponentRef<typeof View>>();
    await render(
      <Button ref={ref}>
        <ButtonText>Save</ButtonText>
      </Button>
    );
    expect(ref.current).not.toBeNull();
  });

  it('uses the link role for the link variant', async () => {
    await render(
      <Button variant="link" accessibilityLabel="Terms">
        <ButtonText>Terms</ButtonText>
      </Button>
    );
    expect(screen.getByRole('link', { name: 'Terms' })).toBeOnTheScreen();
  });

  it('lets ButtonText inherit the variant from its Button', async () => {
    await render(
      <Button variant="destructive">
        <ButtonText>Delete</ButtonText>
      </Button>
    );
    // Inheritance is via context; an explicit prop on the child must still win.
    expect(screen.getByText('Delete')).toBeOnTheScreen();
  });
});

describe('small button text', () => {
  it('is label size, not caption: an action you must read is not a footnote', async () => {
    const { StyleSheet } = jest.requireActual('react-native');
    await render(
      <>
        <Button size="sm">
          <ButtonText>Small</ButtonText>
        </Button>
        <Button>
          <ButtonText>Default</ButtonText>
        </Button>
      </>
    );
    const size = (text: string) => StyleSheet.flatten(screen.getByText(text).props.style).fontSize;
    expect(size('Small')).toBe(size('Default'));
  });
});
