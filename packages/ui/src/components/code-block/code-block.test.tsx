import { Text } from 'react-native';
import { render, screen } from '../../test/render';
import { CodeBlock } from './code-block';

describe('CodeBlock', () => {
  it('presents the language and preserves the source text', async () => {
    await render(<CodeBlock code={'const answer = 42;\nreturn answer;'} language="TypeScript" />);

    expect(screen.getByText('TypeScript')).toBeOnTheScreen();
    expect(screen.getByLabelText('TypeScript code')).toHaveTextContent(
      'const answer = 42;\nreturn answer;'
    );
  });

  it('renders application-owned actions without adding a clipboard dependency', async () => {
    await render(<CodeBlock code="npm test" actions={<Text>Copy</Text>} />);

    expect(screen.getByText('Copy')).toBeOnTheScreen();
  });
});
