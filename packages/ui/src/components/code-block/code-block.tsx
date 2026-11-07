import React from 'react';
import { ScrollView, View, type ViewProps } from 'react-native';
import { Surface } from '../surface';
import { Text } from '../text';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';

export interface CodeBlockProps extends Omit<ViewProps, 'children'> {
  code: string;
  language?: string;
  actions?: React.ReactNode;
}

function CodeBlock({ code, language, actions, className, ...props }: CodeBlockProps) {
  const label = language ? `${language} code` : 'Code';
  const visual = useVisualTokens();

  return (
    <Surface
      level="base"
      padding="none"
      radius="lg"
      shadow="none"
      className={cn('overflow-hidden bg-muted', className)}
      {...props}
    >
      {language || actions ? (
        <View className="flex-row items-center justify-between border-b border-border px-3 py-2">
          <Text variant="caption">{language ?? 'Code'}</Text>
          {actions}
        </View>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: visual.surfacePaddingSm }}
      >
        <Text
          variant="code"
          className="bg-transparent px-0 py-0 text-foreground"
          accessibilityLabel={label}
          selectable
        >
          {code}
        </Text>
      </ScrollView>
    </Surface>
  );
}

CodeBlock.displayName = 'CodeBlock';

export { CodeBlock };
