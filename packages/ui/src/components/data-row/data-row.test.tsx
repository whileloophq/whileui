import { fireEvent, render, screen } from '../../test/render';
import { DataRow, DataRowCenter, DataRowLabel, DataRowRight, DataRowValue } from './data-row';

function Expense(props: React.ComponentProps<typeof DataRow>) {
  return (
    <DataRow {...props}>
      <DataRowCenter>
        <DataRowLabel>Groceries</DataRowLabel>
      </DataRowCenter>
      <DataRowRight>
        <DataRowValue>€42.10</DataRowValue>
      </DataRowRight>
    </DataRow>
  );
}

describe('DataRow', () => {
  it('is plain content without onPress', async () => {
    await render(<Expense />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Groceries')).toBeOnTheScreen();
  });

  it('is one button, named by its content, with onPress', async () => {
    const onPress = jest.fn();
    await render(<Expense onPress={onPress} />);

    const row = screen.getByRole('button', { name: /Groceries.*€42\.10/ });
    await fireEvent.press(row);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(row).not.toBeDisabled();
  });
});

describe('DataRow disabled', () => {
  it('stays a button but does not fire, and says so', async () => {
    const onPress = jest.fn();
    await render(<Expense onPress={onPress} disabled />);
    const row = screen.getByRole('button', { name: /Groceries/ });
    expect(row).toBeDisabled();
    await fireEvent.press(row);
    expect(onPress).not.toHaveBeenCalled();
  });
});
