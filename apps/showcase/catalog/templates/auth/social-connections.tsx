/**
 * SocialConnections — Copy-paste template
 * Copy this file into your app and customize. Uses @thewhileloop/whileui primitives.
 */
import {
  Button,
  ButtonText,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Text,
} from '@thewhileloop/whileui';

export interface SocialConnectionsProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  onGitHubPress?: () => void;
}

export function SocialConnections({
  onGooglePress,
  onApplePress,
  onGitHubPress,
}: SocialConnectionsProps = {}) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Social Connections</CardTitle>
        <CardDescription>Connect your account with social providers.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <Button variant="outline" className="w-full flex-row gap-2" onPress={onGooglePress}>
          <Text className="font-bold">G</Text>
          <ButtonText>Continue with Google</ButtonText>
        </Button>
        <Button variant="outline" className="w-full flex-row gap-2" onPress={onApplePress}>
          <Text className="font-bold">A</Text>
          <ButtonText>Continue with Apple</ButtonText>
        </Button>
        <Button variant="outline" className="w-full flex-row gap-2" onPress={onGitHubPress}>
          <Text className="font-bold">GH</Text>
          <ButtonText>Continue with GitHub</ButtonText>
        </Button>
      </CardContent>
      <CardFooter>
        <Text className="text-xs text-center text-muted-foreground w-full">
          By clicking continue, you agree to our <Text className="underline">Terms of Service</Text>{' '}
          and <Text className="underline">Privacy Policy</Text>.
        </Text>
      </CardFooter>
    </Card>
  );
}
