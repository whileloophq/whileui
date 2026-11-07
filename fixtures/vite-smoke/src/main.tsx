import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button,
  ButtonText,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PortalHost,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type SelectOption,
} from '@thewhileloop/whileui';
import { CodeBlock } from '@thewhileloop/whileui/code';
import { Markdown } from '@thewhileloop/whileui/markdown';

function App() {
  const [selected, setSelected] = React.useState<SelectOption | undefined>();

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: '0 auto', display: 'grid', gap: 16 }}>
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react" label="React" />
          <SelectItem value="expo" label="Expo" />
          <SelectItem value="whileui" label="WhileUI" />
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <ButtonText>Popover</ButtonText>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Text className="text-foreground">Portal-based popover works.</Text>
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button>
            <ButtonText>Tooltip</ButtonText>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="secondary">
            <ButtonText>Hover card</ButtonText>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <Text className="text-foreground">Hover card content</Text>
        </HoverCardContent>
      </HoverCard>

      <Markdown>{'## Optional content\n\nRendered through the **Markdown** subpath.'}</Markdown>
      <CodeBlock code="const target = 'web';" language="TypeScript" />

      <PortalHost />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
