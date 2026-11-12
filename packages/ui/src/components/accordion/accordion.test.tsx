import { fireEvent, render, screen } from '../../test/render';
import { Text } from '../text';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

describe('Accordion', () => {
  it('says whether each panel is open', async () => {
    await render(
      <Accordion type="single">
        <AccordionItem value="native">
          <AccordionTrigger>
            <Text>Is it native?</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text>Yes.</Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const header = screen.getByRole('button', { name: 'Is it native?' });
    expect(header).toBeCollapsed();
    expect(screen.queryByText('Yes.')).toBeNull();

    await fireEvent.press(header);
    expect(header).toBeExpanded();
    expect(screen.getByText('Yes.')).toBeOnTheScreen();
  });
});
