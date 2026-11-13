import { StyleSheet } from 'react-native';
import { SmartInput } from '../blocks/layout/smart-input';
import { Input } from '../components/input/input';
import { NumericInput } from '../components/numeric-input/numeric-input';
import { Textarea } from '../components/textarea/textarea';
import { render, screen } from '../test/render';
import { FontProvider } from './font-context';

// A `TextInput` reads no family from `FontProvider`, so every field typed in the system
// font on iOS and Android beside text in the app's own.
describe('text fields', () => {
  it.each([
    ['Input', <Input key="field" accessibilityLabel="Field" />],
    ['Textarea', <Textarea key="field" accessibilityLabel="Field" />],
    ['NumericInput', <NumericInput key="field" accessibilityLabel="Field" />],
    ['SmartInput', <SmartInput key="field" accessibilityLabel="Field" />],
  ])('%s types in the app font', async (_name, field) => {
    await render(
      <FontProvider value={{ 'font-normal': 'Brand_400Regular' }}>{field}</FontProvider>
    );

    const style = StyleSheet.flatten(screen.getByLabelText('Field').props.style) as {
      fontFamily?: string;
    };
    expect(style.fontFamily).toBe('Brand_400Regular');
  });
});
