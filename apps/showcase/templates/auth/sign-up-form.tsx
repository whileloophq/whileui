/**
 * SignUpForm — Copy-paste template
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
} from '@thewhileloop/whileui';
import { AuthFormFooter } from './auth-form-footer';

export interface SignUpFormProps {
  onSubmit?: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
  onSignIn?: () => void;
  onGooglePress?: () => void;
  onApplePress?: () => void;
}

export function SignUpForm({
  onSubmit,
  onSignIn,
  onGooglePress,
  onApplePress,
}: SignUpFormProps = {}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit?.({ firstName, lastName, email, password });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your details to get started.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <View className="flex-row gap-3">
          <View className="flex-1 gap-2">
            <Label nativeID="first-name">First name</Label>
            <Input placeholder="Jane" value={firstName} onChangeText={setFirstName} />
          </View>
          <View className="flex-1 gap-2">
            <Label nativeID="last-name">Last name</Label>
            <Input placeholder="Doe" value={lastName} onChangeText={setLastName} />
          </View>
        </View>
        <View className="gap-2">
          <Label nativeID="signup-email">Email</Label>
          <Input
            placeholder="you@email.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View className="gap-2">
          <Label nativeID="signup-password">Password</Label>
          <Input
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </CardContent>
      <AuthFormFooter
        primaryLabel="Create Account"
        onPrimaryPress={handleSubmit}
        onGooglePress={onGooglePress}
        onApplePress={onApplePress}
        accountPrompt="Already have an account?"
        accountAction="Sign In"
        onAccountPress={onSignIn}
      />
    </Card>
  );
}
