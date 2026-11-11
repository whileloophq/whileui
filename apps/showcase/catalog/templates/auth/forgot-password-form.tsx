/**
 * ForgotPasswordForm — Copy-paste template
 * Copy this file into your app and customize. Uses @thewhileloop/whileui primitives.
 */
import { useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  ButtonText,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Pressable,
  Text,
} from '@thewhileloop/whileui';

export interface ForgotPasswordFormProps {
  onSubmit?: (data: { email: string }) => void;
  onBackToSignIn?: () => void;
}

export function ForgotPasswordForm({ onSubmit, onBackToSignIn }: ForgotPasswordFormProps = {}) {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    onSubmit?.({ email });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>Enter your email to reset your password.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <View className="gap-2">
          <Label nativeID="forgot-email">Email</Label>
          <Input
            placeholder="you@email.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button className="w-full" onPress={handleSubmit}>
          <ButtonText>Send Reset Link</ButtonText>
        </Button>
        <Pressable
          onPress={onBackToSignIn}
          className="flex-row justify-center"
          accessibilityRole="button"
        >
          <Text className="text-sm text-center text-muted-foreground">
            Remember your password?{' '}
            <Text className="text-primary underline font-medium">Back to Sign In</Text>
          </Text>
        </Pressable>
      </CardFooter>
    </Card>
  );
}
