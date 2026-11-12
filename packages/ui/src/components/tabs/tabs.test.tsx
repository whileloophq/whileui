import { fireEvent, render, screen } from '../../test/render';
import { Text } from '../text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

describe('Tabs', () => {
  it('selects a tab, shows its panel and reports the change once', async () => {
    const onValueChange = jest.fn();
    await render(
      <Tabs defaultValue="preview" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="preview">
            <Text>Preview</Text>
          </TabsTrigger>
          <TabsTrigger value="code">
            <Text>Code</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <Text>Rendered card</Text>
        </TabsContent>
        <TabsContent value="code">
          <Text>Source</Text>
        </TabsContent>
      </Tabs>
    );

    expect(screen.getByRole('tab', { name: 'Preview' })).toBeSelected();
    expect(screen.getByText('Rendered card')).toBeOnTheScreen();
    expect(screen.queryByText('Source')).toBeNull();

    await fireEvent.press(screen.getByRole('tab', { name: 'Code' }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('code');
    expect(screen.getByRole('tab', { name: 'Code' })).toBeSelected();
    expect(screen.getByText('Source')).toBeOnTheScreen();
  });
});
