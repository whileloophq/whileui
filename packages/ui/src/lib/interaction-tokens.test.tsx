import { Text } from 'react-native';
import { useCSSVariable } from 'uniwind';
import { render, screen } from '../test/render';
import { INTERACTION_TOKENS, useInteractionTokens } from './interaction-tokens';

function Probe() {
  const tokens = useInteractionTokens();
  return <Text testID="tokens">{tokens === INTERACTION_TOKENS ? 'same' : 'copy'}</Text>;
}

describe('useInteractionTokens', () => {
  it('returns the one interaction table and does not read CSS variables', async () => {
    await render(<Probe />);

    expect(screen.getByTestId('tokens').props.children).toBe('same');
    expect(useCSSVariable).not.toHaveBeenCalled();
  });
});
