import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  ButtonText,
  DockedInput,
  KeyboardAwareScreen,
  SmartInput,
  Text,
} from '@thewhileloop/whileui';

/**
 * Full-screen keyboard harness. The Layout tab's clipped Smart Input is 144px tall, so a
 * field inside it never has to clear a real keyboard. This screen is the one the native
 * and browser flows drive.
 */
export function KeyboardDockScreen({ onClose }: { onClose: () => void }) {
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState('');

  return (
    <KeyboardAwareScreen style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View className="flex-1 px-5 pt-4">
          <Button
            variant="outline"
            accessibilityLabel="Close keyboard screen"
            testID="close-keyboard-screen"
            onPress={onClose}
            className="self-start"
          >
            <ButtonText>Close</ButtonText>
          </Button>
          <Text className="mt-6 text-2xl font-bold text-foreground">Message</Text>
          <Text className="mt-2 text-base text-muted-foreground">
            The field and send button stay above the keyboard.
          </Text>
          <Text className="mt-6 text-base text-foreground" testID="keyboard-sent">
            {sent.length > 0 ? `Sent: ${sent}` : 'Nothing sent'}
          </Text>
        </View>
      </SafeAreaView>
      <DockedInput>
        <SmartInput
          accessibilityLabel="Message"
          testID="keyboard-message"
          value={draft}
          onChangeText={setDraft}
          placeholder="Write a message"
          safeArea={false}
          variant="bar"
          rightSlot={
            <Button
              accessibilityLabel="Send message"
              testID="keyboard-send"
              onPress={() => setSent(draft)}
            >
              <ButtonText>Send</ButtonText>
            </Button>
          }
        />
      </DockedInput>
    </KeyboardAwareScreen>
  );
}
