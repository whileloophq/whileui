/**
 * ResetPasswordForm — Copy-paste template
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
} from '@thewhileloop/whileui';

export interface ResetPasswordFormProps {
  onSubmit?: (data: { password: string; confirmPassword: string }) => void;
}

export function ResetPasswordForm({ onSubmit }: ResetPasswordFormProps = {}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    onSubmit?.({ password, confirmPassword });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <View className="gap-2">
          <Label nativeID="new-password">New Password</Label>
          <Input
            placeholder="********"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View className="gap-2">
          <Label nativeID="confirm-password">Confirm Password</Label>
          <Input
            placeholder="********"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onPress={handleSubmit}>
          <ButtonText>Reset Password</ButtonText>
        </Button>
      </CardFooter>
    </Card>
  );
}
