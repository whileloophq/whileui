import { useState } from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  DataRow,
  DataRowCenter,
  DataRowLabel,
  DataRowRight,
  DataRowValue,
  ListItem,
  NotificationItem,
  Pagination,
  SectionedList,
  TimelineFeed,
  useIconColors,
} from '@thewhileloop/whileui';
import { Section } from '../ui';

const EXPENSES = [
  { id: '1', month: 'November 2026', name: 'Ramen', amount: '¥2,400' },
  { id: '2', month: 'November 2026', name: 'Train to Nara', amount: '¥1,560' },
  { id: '3', month: 'October 2026', name: 'Hotel deposit', amount: '¥18,000' },
  { id: '4', month: 'October 2026', name: 'Airport bus', amount: '¥3,200' },
];

export function ListsBlocksTab() {
  const colors = useIconColors();
  const [page, setPage] = useState(1);

  return (
    <View className="gap-6">
      <Section
        title="Sectioned List"
        subtitle="Headings where the section changes; none when there is one section"
      >
        <View className="overflow-hidden rounded-xl border border-border">
          <SectionedList
            items={EXPENSES}
            sectionOf={(expense) => expense.month}
            keyOf={(expense) => expense.id}
            renderItem={(expense) => (
              <DataRow className="px-3" onPress={() => {}}>
                <DataRowCenter>
                  <DataRowLabel>{expense.name}</DataRowLabel>
                </DataRowCenter>
                <DataRowRight>
                  <DataRowValue>{expense.amount}</DataRowValue>
                </DataRowRight>
              </DataRow>
            )}
          />
          <Pagination
            page={page}
            totalPages={4}
            totalItems={83}
            onPageChange={setPage}
            className="border-t border-border px-3 py-2"
          />
        </View>
      </Section>

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
