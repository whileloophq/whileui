import { render, screen } from '../../test/render';
import { LoadingState } from './loading-state';

describe('LoadingState', () => {
  it('names its spinner for assistive technology and shows the label', async () => {
    await render(<LoadingState label="Loading expenses" />);

    // The progressbar role is React Native Web's; under Jest the spinner is reachable
    // by its accessible name alone.
    expect(screen.getByLabelText('Loading expenses')).toBeOnTheScreen();
    expect(screen.getByText('Loading expenses')).toBeOnTheScreen();
  });

  it('still has an accessible name without a label', async () => {
    await render(<LoadingState />);

    expect(screen.getByLabelText('Loading')).toBeOnTheScreen();
  });
});
