import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  Badge,
  BadgeText,
  Button,
  Chat,
  type ChatMessage,
  ChatMessageBubble,
  Text,
  useIconColors,
  useToast,
} from '@thewhileloop/whileui';
import { CodeBlock } from '@thewhileloop/whileui/code';
import { Markdown } from '@thewhileloop/whileui/markdown';
import { triggerHaptic } from '../ui';

const EXAMPLE_CHAT_MESSAGE: ChatMessage = {
  id: 'example',
  role: 'assistant',
  content:
    'I can help with summaries, explanations, translations, and more. Try a suggestion below or type your own question.',
  secondary: 'Example message',
  contentSize: 'default',
};

export function ChatBlocksTab({
  onBack,
  onMenuPress,
  colors,
}: {
  onBack?: () => void;
  onMenuPress?: () => void;
  colors?: ReturnType<typeof useIconColors>;
}) {
  const fallbackColors = useIconColors();
  const iconColors = colors ?? fallbackColors;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();

  const renderMessage = (message: ChatMessage) => {
    if (message.role !== 'assistant') return <ChatMessageBubble message={message} />;

    return (
      <View className="w-full gap-3">
        <View className="flex-row items-center gap-2">
          <Badge variant="secondary">
            <BadgeText>AI</BadgeText>
          </Badge>
          <Text className="font-semibold text-foreground">Assistant</Text>
        </View>
        <Markdown>{message.content}</Markdown>
        <View className="gap-1 border-l-2 border-border pl-3">
          <Text className="font-medium text-foreground">Reasoning trace</Text>
          <Text className="text-sm text-muted-foreground">
            Reviewed the available primitives and mapped the response into reusable sections.
          </Text>
        </View>
        <CodeBlock
          language="Tool call · searchDocs"
          code={'{ "query": "conversation patterns" }'}
        />
        <View className="flex-row items-center gap-2 border-t border-border pt-3">
          <Feather name="link" size={14} color={iconColors.muted} />
          <Text className="text-sm text-muted-foreground">2 supporting sources</Text>
        </View>
      </View>
    );
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    triggerHaptic('medium');
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', content: inputValue.trim(), secondary: 'Just now' },
    ]);
    setInputValue('');
    toast({ title: 'Sent' });
  };

  return (
    <View style={{ flex: 1 }}>
      <Chat
        messages={messages}
        value={inputValue}
        onChangeText={setInputValue}
        onSend={handleSend}
        placeholder="Message..."
        suggestions={[
          'Summarize this document',
          "Explain like I'm 5",
          'Translate to Spanish',
          'Write a haiku',
        ]}
        onSuggestionPress={(text) => {
          setInputValue(text);
          toast({ title: 'Suggestion selected' });
        }}
        emptyTitle="How can I help?"
        emptyDescription="Ask anything. Supports text, images & attachments."
        exampleMessage={EXAMPLE_CHAT_MESSAGE}
        renderMessage={renderMessage}
        header={
          <View className="flex-row items-center gap-3 border-b border-border bg-background px-4 py-3">
            {onBack && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back"
                onPress={onBack}
                className="w-10 h-10 items-center justify-center rounded-xl active:opacity-70 -ml-1"
              >
                <Feather name="arrow-left" size={22} color={iconColors.foreground} />
              </Pressable>
            )}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-foreground">Chat</Text>
              <Text className="text-sm text-muted-foreground">AI conversation</Text>
            </View>
            {onMenuPress && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open menu"
                onPress={onMenuPress}
                className="w-10 h-10 items-center justify-center rounded-xl bg-muted active:opacity-70"
              >
                <Feather name="menu" size={20} color={iconColors.foreground} />
              </Pressable>
            )}
          </View>
        }
        leftSlot={
          <Button
            variant="ghost"
            size="icon"
            accessibilityLabel="Attach"
            onPress={() => toast({ title: 'Attach (coming soon)' })}
          >
            <Feather name="paperclip" size={20} color={iconColors.foreground} />
          </Button>
        }
        rightSlot={
          <Button
            size="icon"
            accessibilityLabel="Send"
            disabled={!inputValue.trim()}
            onPress={handleSend}
          >
            <Feather name="send" size={18} color={iconColors.primaryForeground} />
          </Button>
        }
      />
    </View>
  );
}
