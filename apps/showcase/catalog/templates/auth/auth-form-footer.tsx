import { View } from 'react-native';
import { Button, ButtonText, CardFooter, Pressable, Separator, Text } from '@thewhileloop/whileui';

interface AuthFormFooterProps {
  primaryLabel: string;
  onPrimaryPress: () => void;
  onGooglePress?: () => void;
  onApplePress?: () => void;
  accountPrompt: string;
  accountAction: string;
  onAccountPress?: () => void;
}

export function AuthFormFooter({
  primaryLabel,
  onPrimaryPress,
  onGooglePress,
  onApplePress,
  accountPrompt,
  accountAction,
  onAccountPress,
}: AuthFormFooterProps) {
  return (
    <CardFooter className="flex-col gap-4">
      <Button className="w-full" onPress={onPrimaryPress}>
        <ButtonText>{primaryLabel}</ButtonText>
      </Button>
      <View className="flex-row items-center gap-3 w-full">
        <Separator className="flex-1" />
        <Text className="text-xs text-muted-foreground uppercase">or</Text>
        <Separator className="flex-1" />
      </View>
      <View className="flex-row gap-3 w-full">
        <Button variant="outline" className="flex-1" onPress={onGooglePress}>
          <ButtonText>Google</ButtonText>
        </Button>
        <Button variant="outline" className="flex-1" onPress={onApplePress}>
          <ButtonText>Apple</ButtonText>
        </Button>
      </View>
      <Pressable
        onPress={onAccountPress}
        className="flex-row justify-center"
        accessibilityRole="button"
      >
        <Text className="text-sm text-center text-muted-foreground">
          {accountPrompt} <Text className="text-primary font-medium">{accountAction}</Text>
        </Text>
      </Pressable>
    </CardFooter>
  );
}
