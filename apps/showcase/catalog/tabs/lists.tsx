import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ListItem, NotificationItem, TimelineFeed, useIconColors } from '@thewhileloop/whileui';
import { Section } from '../ui';

export function ListsBlocksTab() {
  const colors = useIconColors();

  return (
    <View className="gap-6">
      <Section title="List Items" subtitle="Standard list rows">
        <View className="rounded-xl overflow-hidden border border-border">
          <ListItem
            icon={<Feather name="mail" size={20} color={colors.muted} />}
            title="Email Notifications"
            subtitle="Receive updates via email"
            rightText="On"
          />
          <ListItem
            icon={<Feather name="smartphone" size={20} color={colors.muted} />}
            title="Push Notifications"
            subtitle="Get notified on your device"
          />
          <ListItem
            icon={<Feather name="volume-2" size={20} color={colors.muted} />}
            title="Sound Effects"
            description="Play sounds for actions and notifications"
            showBorder={false}
          />
        </View>
      </Section>

      <Section title="Notifications" subtitle="Activity feed items">
        <View className="rounded-xl overflow-hidden border border-border">
          <NotificationItem
            avatarFallback="SM"
            title="Sarah Miller"
            message="Starred your component library"
            time="2m ago"
            read={false}
          />
          <NotificationItem
            avatarFallback="TK"
            title="Tom Kang"
            message="Requested access to your workspace"
            time="1h ago"
            read={true}
          />
          <NotificationItem
            icon={<Feather name="award" size={20} color={colors.primary} />}
            title="Milestone reached!"
            message="Your library has 1,000 installs"
            time="2d ago"
            read={true}
          />
        </View>
      </Section>

      <Section title="Loading States" subtitle="Component-level skeleton placeholders">
        <View className="rounded-xl overflow-hidden border border-border">
          <ListItem loading title="" />
          <ListItem loading title="" />
          <ListItem loading title="" showBorder={false} />
        </View>
        <View className="mt-3 rounded-xl overflow-hidden border border-border">
          <NotificationItem loading title="" message="" time="" />
          <NotificationItem loading title="" message="" time="" />
        </View>
      </Section>

      <Section title="Timeline Feed" subtitle="Vertical feed with connecting lines">
        <TimelineFeed
          items={[
            {
              id: '1',
              title: 'Order Placed',
              subtitle: 'Your order has been received',
              time: '10:30 AM',
            },
            {
              id: '2',
              title: 'Processing',
              subtitle: 'We are preparing your order',
              time: '11:15 AM',
            },
            { id: '3', title: 'Shipped', subtitle: 'Your order is on the way', time: '2:45 PM' },
          ]}
        />
      </Section>
    </View>
  );
}
