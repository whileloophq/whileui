/**
 * SignInForm — Copy-paste template
 * Copy this file with auth-form-footer.tsx and customize. Uses WhileUI primitives.
 */
import { useState } from 'react';
import { View } from 'react-native';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Pressable,
  Text,
} from '@thewhileloop/whileui';
import { AuthFormFooter } from './auth-form-footer';

export interface SignInFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onGooglePress?: () => void;
  onApplePress?: () => void;
}

export function SignInForm({
  onSubmit,
  onForgotPassword,
  onSignUp,
  onGooglePress,
  onApplePress,
}: SignInFormProps = {}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit?.({ email, password });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <View className="gap-2">
          <Label nativeID="email">Email</Label>
          <Input
            placeholder="you@email.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Label nativeID="password">Password</Label>
            <Pressable onPress={onForgotPassword} accessibilityRole="button">
              <Text className="text-sm text-primary font-medium">Forgot?</Text>
            </Pressable>
          </View>
          <Input
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </CardContent>
      <AuthFormFooter
        primaryLabel="Sign In"
        onPrimaryPress={handleSubmit}
        onGooglePress={onGooglePress}
        onApplePress={onApplePress}
        accountPrompt="Don't have an account?"
        accountAction="Sign Up"
        onAccountPress={onSignUp}
      />
    </Card>
  );
}
