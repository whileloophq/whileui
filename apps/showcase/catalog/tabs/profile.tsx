import { useState } from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AccountCard, ProfileHeader, SettingsItem, SettingsSection } from '../templates/profile';
import { useIconColors } from '@thewhileloop/whileui';
import { Section } from '../ui';

export function ProfileBlocksTab() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const colors = useIconColors();

  return (
    <View className="gap-6">
      <Section title="Profile Header" subtitle="User profile with stats">
        <ProfileHeader
          name="Sarah Miller"
          username="sarahmiller"
          bio="Product designer building beautiful interfaces. React Native enthusiast."
          avatarFallback="SM"
          stats={[
            { label: 'Following', value: 234 },
            { label: 'Followers', value: '12.5K' },
            { label: 'Projects', value: 42 },
          ]}
          action={{ label: 'Edit Profile', onPress: () => {} }}
          verified
        />
      </Section>

      <Section title="Account Card" subtitle="Compact user info">
        <AccountCard
          name="Sarah Miller"
          email="sarah@whileui.dev"
          avatarFallback="SM"
          badge="Pro"
          onPress={() => {}}
        />
      </Section>

      <Section title="Settings" subtitle="Grouped preference controls">
        <SettingsSection title="Preferences">
          <SettingsItem
            icon={<Feather name="bell" size={20} color={colors.muted} />}
            label="Push Notifications"
            type="toggle"
            toggleValue={notificationsEnabled}
            onToggle={setNotificationsEnabled}
          />
          <SettingsItem
            icon={<Feather name="moon" size={20} color={colors.muted} />}
            label="Dark Mode"
            type="toggle"
            toggleValue={darkModeEnabled}
            onToggle={setDarkModeEnabled}
          />
          <SettingsItem
            icon={<Feather name="lock" size={20} color={colors.muted} />}
            label="Privacy"
            value="Public"
            onPress={() => {}}
          />
          <SettingsItem
            icon={<Feather name="log-out" size={20} color={colors.muted} />}
            label="Sign Out"
            type="action"
            onPress={() => {}}
            destructive
            showBorder={false}
          />
        </SettingsSection>
      </Section>
    </View>
  );
}
