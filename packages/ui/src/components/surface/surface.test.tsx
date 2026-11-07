import { render, screen } from '../../test/render';
import { Surface } from './surface';

describe('Surface', () => {
  it('maps a raised surface to the shared shape, spacing, and depth tokens', async () => {
    await render(<Surface testID="surface" level="raised" />);

    expect(screen.getByTestId('surface')).toHaveStyle({
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      shadowOpacity: 0.06,
    });
  });

  it('keeps caller styles last', async () => {
    await render(<Surface testID="surface" style={{ padding: 7 }} />);

    expect(screen.getByTestId('surface')).toHaveStyle({ padding: 7 });
  });
});
