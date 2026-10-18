import { render, screen } from '../../test/render';
import { INTERACTION_TOKENS } from '../../lib/interaction-tokens';
import { FormControl, FormField, FormHint, FormLabel, FormMessage } from './form-field';

describe('FormField', () => {
  it('renders the label, hint, and message', async () => {
    await render(
      <FormField>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <FormHint>Work address</FormHint>
        </FormControl>
        <FormMessage>Required</FormMessage>
      </FormField>
    );

    expect(screen.getByText('Email')).toBeOnTheScreen();
    expect(screen.getByText('Work address')).toBeOnTheScreen();
    expect(screen.getByText('Required')).toBeOnTheScreen();
  });

  it('marks a required field', async () => {
    await render(
      <FormField required>
        <FormLabel>Email</FormLabel>
      </FormField>
    );

    expect(screen.getByText(' *')).toBeOnTheScreen();
  });

  it('renders nothing for an empty message', async () => {
    await render(
      <FormField>
        <FormMessage>{undefined}</FormMessage>
      </FormField>
    );

    expect(screen.queryByText('Required')).not.toBeOnTheScreen();
  });

  it('uses the destructive label when invalid', async () => {
    await render(
      <FormField invalid>
        <FormLabel>Email</FormLabel>
      </FormField>
    );

    expect(screen.getByText('Email').props.className).toContain('text-destructive');
  });

  it('fades a disabled field with the soft disabled opacity', async () => {
    await render(
      <FormField testID="field" disabled>
        <FormLabel>Email</FormLabel>
      </FormField>
    );

    expect(screen.getByTestId('field').props.style).toEqual({
      opacity: INTERACTION_TOKENS.disabledOpacitySoft,
    });
    expect(screen.getByText('Email').props.className).toContain('text-muted-foreground');
  });
});
