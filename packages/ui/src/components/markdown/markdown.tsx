import React, { useMemo } from 'react';
import { View, type StyleProp, type TextStyle, type ViewProps } from 'react-native';
import MarkdownIt from 'markdown-it';
import { CodeBlock } from '../code-block';
import { Text } from '../text';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';

type MarkdownToken = ReturnType<MarkdownIt['parse']>[number];

interface TokenNode {
  token: MarkdownToken;
  children: TokenNode[];
}

export interface MarkdownProps extends Omit<ViewProps, 'children'> {
  children: string;
  onLinkPress?: (url: string) => void;
  codeActions?: (code: string, language: string | undefined) => React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
  selectable?: boolean;
}

const parser = new MarkdownIt({ html: false, linkify: true, typographer: true });

function toTree(tokens: MarkdownToken[]): TokenNode[] {
  const root: TokenNode[] = [];
  const stack: TokenNode[][] = [root];

  for (const token of tokens) {
    if (token.nesting === -1) {
      stack.pop();
      continue;
    }
    const node = { token, children: [] };
    stack[stack.length - 1]?.push(node);
    if (token.nesting === 1) stack.push(node.children);
  }

  return root;
}

function getAttribute(token: MarkdownToken, name: string): string | undefined {
  return token.attrGet(name) ?? undefined;
}

function Markdown({
  children,
  onLinkPress,
  codeActions,
  textStyle,
  selectable = true,
  className,
  ...props
}: MarkdownProps) {
  const visual = useVisualTokens();
  const nodes = useMemo(() => toTree(parser.parse(children, {})), [children]);

  const renderInline = (node: TokenNode, key: string): React.ReactNode => {
    const { token } = node;
    if (token.type === 'text') return token.content;
    if (token.type === 'softbreak' || token.type === 'hardbreak') return '\n';
    if (token.type === 'code_inline') {
      return (
        <Text key={key} variant="code" selectable={selectable}>
          {token.content}
        </Text>
      );
    }
    if (token.type === 'image') return token.content;

    const content = node.children.map((child, index) => renderInline(child, `${key}-${index}`));
    if (token.type === 'strong_open')
      return (
        <Text key={key} className="font-bold">
          {content}
        </Text>
      );
    if (token.type === 'em_open')
      return (
        <Text key={key} style={{ fontStyle: 'italic' }}>
          {content}
        </Text>
      );
    if (token.type === 's_open')
      return (
        <Text key={key} style={{ textDecorationLine: 'line-through' }}>
          {content}
        </Text>
      );
    if (token.type === 'link_open') {
      const href = getAttribute(token, 'href');
      return (
        <Text
          key={key}
          className="text-primary underline"
          accessibilityRole={onLinkPress ? 'link' : undefined}
          onPress={href && onLinkPress ? () => onLinkPress(href) : undefined}
        >
          {content}
        </Text>
      );
    }
    return content;
  };

  const renderNode = (node: TokenNode, key: string, listIndex?: number): React.ReactNode => {
    const { token } = node;
    if (token.type === 'inline') {
      return toTree(token.children ?? []).map((child, index) =>
        renderInline(child, `${key}-${index}`)
      );
    }
    if (token.type === 'paragraph_open') {
      return (
        <Text key={key} variant="body" style={textStyle} selectable={selectable}>
          {node.children.map((child, index) => renderNode(child, `${key}-${index}`))}
        </Text>
      );
    }
    if (token.type === 'heading_open') {
      const level = Number(token.tag.slice(1));
      const variant = level === 1 ? 'heading' : level === 2 ? 'title' : 'subtitle';
      return (
        <Text
          key={key}
          variant={variant}
          accessibilityRole="header"
          style={textStyle}
          selectable={selectable}
        >
          {node.children.map((child, index) => renderNode(child, `${key}-${index}`))}
        </Text>
      );
    }
    if (token.type === 'fence' || token.type === 'code_block') {
      const language = token.info.trim().split(/\s+/)[0] || undefined;
      return (
        <CodeBlock
          key={key}
          code={token.content.replace(/\n$/, '')}
          language={language}
          actions={codeActions?.(token.content, language)}
        />
      );
    }
    if (token.type === 'bullet_list_open' || token.type === 'ordered_list_open') {
      const ordered = token.type === 'ordered_list_open';
      const start = Number(getAttribute(token, 'start') ?? 1);
      return (
        <View key={key} className="gap-2">
          {node.children.map((child, index) =>
            renderNode(child, `${key}-${index}`, ordered ? start + index : undefined)
          )}
        </View>
      );
    }
    if (token.type === 'list_item_open') {
      return (
        <View key={key} className="flex-row items-start gap-2">
          <Text variant="body">{listIndex === undefined ? '•' : `${listIndex}.`}</Text>
          <View className="min-w-0 flex-1 gap-1">
            {node.children.map((child, index) => renderNode(child, `${key}-${index}`))}
          </View>
        </View>
      );
    }
    if (token.type === 'blockquote_open') {
      return (
        <View
          key={key}
          className="border-l border-border bg-muted"
          style={{
            borderLeftWidth: visual.borderWidthEmphasis,
            paddingHorizontal: visual.surfacePaddingSm,
            paddingVertical: visual.controlPaddingYSm,
          }}
        >
          {node.children.map((child, index) => renderNode(child, `${key}-${index}`))}
        </View>
      );
    }
    if (token.type === 'hr') return <View key={key} className="h-px bg-border" />;
    return node.children.map((child, index) => renderNode(child, `${key}-${index}`));
  };

  return (
    <View className={cn('gap-3', className)} {...props}>
      {nodes.map((node, index) => renderNode(node, String(index)))}
    </View>
  );
}

Markdown.displayName = 'Markdown';

export { Markdown };
