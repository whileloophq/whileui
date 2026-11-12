import { useState } from 'react';
import { Modal, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText, Input, KeyboardAwareScrollView, Text } from '@thewhileloop/whileui';

const FIELDS = [
  'Name',
  'Company',
  'Street',
  'Flat or floor',
  'City',
  'Region',
  'Postcode',
  'Country',
  'Phone',
  'Email',
  'Delivery note',
];

/**
 * A form in a native iOS page sheet: the layout where `KeyboardAvoidingView` misjudges
 * the keyboard, because nothing it measures includes where iOS placed the sheet. Focus
 * the last field — it should rise above the keyboard. Other platforms show the same
 * form full screen.
 *
 * The modal gets its own `SafeAreaProvider`, which measures the modal's frame: no top
 * inset in an iOS page sheet, the status bar's height on Android, where the modal is full
 * screen and drew its header under the status bar.
 */
export function KeyboardFormSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        accessibilityLabel="Open form sheet"
        onPress={() => setOpen(true)}
        className="self-start"
      >
        <ButtonText>Open form sheet</ButtonText>
      </Button>
      <Modal
        visible={open}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setOpen(false)}
      >
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <View className="flex-1 bg-background">
              <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
                <Text variant="title">Delivery address</Text>
                <Button size="sm" onPress={() => setOpen(false)}>
                  <ButtonText>Done</ButtonText>
                </Button>
              </View>
              <KeyboardAwareScrollView contentContainerClassName="gap-4 p-4">
                {FIELDS.map((field) => (
                  <Input key={field} placeholder={field} accessibilityLabel={field} />
                ))}
              </KeyboardAwareScrollView>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
    </>
  );
}
