import { render, screen } from '../../test/render';
import { INTERACTION_TOKENS } from '../../lib/interaction-tokens';
import { FormControl, FormField, FormHint, FormLabel, FormMessage } from './form-field';
import { Input } from '../input';
import { NumericInput } from '../numeric-input';
import { Textarea } from '../textarea';
import { Select, SelectTrigger, SelectValue } from '../select';

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

    // Shown, but hidden from assistive technology: the control announces required.
    expect(screen.getByText(' *', { includeHiddenElements: true })).toBeOnTheScreen();
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

  it('passes disabled state to its editable controls', async () => {
    await render(
      <FormField disabled>
        <Input placeholder="Email" />
        <Textarea placeholder="Notes" />
        <NumericInput accessibilityLabel="Amount" />
      </FormField>
    );

    expect(screen.getByPlaceholderText('Email')).toBeDisabled();
    expect(screen.getByPlaceholderText('Notes')).toBeDisabled();
    expect(screen.getByLabelText('Amount')).toBeDisabled();
  });

  it('passes invalid state to its controls while explicit props take precedence', async () => {
    await render(
      <FormField invalid disabled>
        <Input placeholder="Inherited" />
        <Input placeholder="Override" variant="plain" editable />
      </FormField>
    );

    expect(screen.getByPlaceholderText('Inherited').props['aria-invalid']).toBe(true);
    expect(screen.getByPlaceholderText('Override').props['aria-invalid']).toBe(true);
    expect(screen.getByPlaceholderText('Override')).not.toBeDisabled();
  });

  it('passes disabled and invalid state through the select compound control', async () => {
    await render(
      <FormField invalid disabled>
        <Select>
          <SelectTrigger accessibilityLabel="Plan">
            <SelectValue />
          </SelectTrigger>
        </Select>
      </FormField>
    );

    const trigger = screen.getByLabelText('Plan');
    expect(trigger).toBeDisabled();
    expect(trigger.props['aria-invalid']).toBe(true);
  });

  it('names each text control by its FormLabel', async () => {
    // 2026-11-11: NumericInput in a FormField had no accessible name on web; Input only
    // looked named because the browser fell back to its placeholder.
    await render(
      <>
        <FormField>
          <FormLabel>Weight</FormLabel>
          <NumericInput value={72} />
        </FormField>
        <FormField>
          <FormLabel>Bio</FormLabel>
          <Textarea />
        </FormField>
        <FormField>
          <FormLabel>Email</FormLabel>
          <Input placeholder="you@company.com" />
        </FormField>
      </>
    );

    expect(screen.getByLabelText('Weight')).toBeOnTheScreen();
    expect(screen.getByLabelText('Bio')).toBeOnTheScreen();
    expect(screen.getByLabelText('Email')).toBeOnTheScreen();
  });

  it('announces required once, without the asterisk', async () => {
    await render(
      <FormField required>
        <FormLabel>Email</FormLabel>
        <Input />
      </FormField>
    );

    expect(screen.queryByText('*', { exact: false })).toBeNull();
    // RNTL joins hidden children into the label text ("Email *"); browsers do not.
    expect(screen.getByLabelText('Email', { exact: false }).props['aria-required']).toBe(true);
  });

  it("keeps the caller's own label", async () => {
    await render(
      <FormField>
        <FormLabel>Amount</FormLabel>
        <NumericInput value={5} accessibilityLabel="Amount in dollars" />
      </FormField>
    );

    expect(screen.getByLabelText('Amount in dollars')).toBeOnTheScreen();
  });
});
