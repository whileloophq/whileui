import { render, screen } from '../../test/render';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Surface } from './surface';

describe('Surface', () => {
  it('maps a raised surface to the shared shape, spacing, and depth tokens', async () => {
    await render(<Surface testID="surface" level="raised" />);

    const surface = screen.getByTestId('surface');
    expect(surface).toHaveStyle({ borderRadius: 24, padding: 24, borderWidth: 1 });
    // Depth is an outset box shadow, never elevation or shadow* props, so it cannot show
    // through a translucent surface. The sm tier's opacity token rides in its colour.
    const boxShadow = (StyleSheet.flatten(surface.props.style as StyleProp<ViewStyle>) ?? {})
      .boxShadow;
    if (!Array.isArray(boxShadow)) throw new Error('expected a box shadow list');
    expect(String(boxShadow[0]!.color)).toContain('0.06');
  });

  it('keeps caller styles last', async () => {
    await render(<Surface testID="surface" style={{ padding: 7 }} />);

    expect(screen.getByTestId('surface')).toHaveStyle({ padding: 7 });
  });
});
