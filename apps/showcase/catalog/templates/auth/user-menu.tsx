/**
 * UserMenu — Copy-paste template
 * Copy this file into your app and customize. Uses @thewhileloop/whileui primitives.
 */
import { View } from 'react-native';
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from '@thewhileloop/whileui';

export interface UserMenuProps {
  email?: string;
  name?: string;
  avatarFallback?: string;
  onSelect?: (key: string) => void;
}

export function UserMenu({
  email = 'user@email.com',
  name = 'My Account',
  avatarFallback = 'U',
  onSelect,
}: UserMenuProps = {}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="font-normal">
          <View className="flex flex-col gap-1">
            <Text className="text-sm font-medium leading-none text-foreground">{name}</Text>
            <Text className="text-xs leading-none text-muted-foreground">{email}</Text>
          </View>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onPress={() => onSelect?.('profile')}>
          <Text className="text-foreground">Profile</Text>
        </DropdownMenuItem>
        <DropdownMenuItem onPress={() => onSelect?.('billing')}>
          <Text className="text-foreground">Billing</Text>
        </DropdownMenuItem>
        <DropdownMenuItem onPress={() => onSelect?.('settings')}>
          <Text className="text-foreground">Settings</Text>
        </DropdownMenuItem>
        <DropdownMenuItem onPress={() => onSelect?.('new-team')}>
          <Text className="text-foreground">New Team</Text>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onPress={() => onSelect?.('logout')}>
          <Text className="text-destructive">Log out</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
