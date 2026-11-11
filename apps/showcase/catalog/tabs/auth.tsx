import { View } from 'react-native';
import {
  ForgotPasswordForm,
  ResetPasswordForm,
  SignInForm,
  SignUpForm,
  SocialConnections,
  UserMenu,
  VerifyEmailForm,
} from '../templates/auth';
import { Section } from '../ui';

export function AuthBlocksTab() {
  return (
    <View className="gap-6">
      <Section title="Sign In" subtitle="Email & password authentication">
        <SignInForm />
      </Section>
      <Section title="Sign Up" subtitle="New account registration">
        <SignUpForm />
      </Section>
      <Section title="Forgot Password" subtitle="Password recovery flow">
        <ForgotPasswordForm />
      </Section>
      <Section title="Verify Email" subtitle="OTP verification">
        <VerifyEmailForm />
      </Section>
      <Section title="Reset Password" subtitle="Set a new password">
        <ResetPasswordForm />
      </Section>
      <Section title="Social Login" subtitle="Third-party authentication">
        <SocialConnections />
      </Section>
      <Section title="User Menu" subtitle="Signed-in user dropdown">
        <View className="items-start">
          <UserMenu />
        </View>
      </Section>
    </View>
  );
}
