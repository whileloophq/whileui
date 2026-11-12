import { useState } from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  Avatar,
  AvatarFallback,
  BottomNav,
  Button,
  ButtonText,
  FloatingBottomNav,
  Header,
  HeaderBackButton,
  PageHeader,
  TabBar,
  type NavIconState,
  useIconColors,
} from '@thewhileloop/whileui';
import { Section } from '../ui';

const TAB_BAR_ITEMS = [
  { key: 'all', label: 'All' },
  { key: 'following', label: 'Following' },
  { key: 'popular', label: 'Trending' },
  { key: 'recent', label: 'New' },
];

export function NavigationBlocksTab() {
  const [activeNav, setActiveNav] = useState('home');
  const [activeTabBar, setActiveTabBar] = useState('all');
  const colors = useIconColors();

  const navItems = [
    {
      key: 'home',
      label: 'Home',
      icon: ({ color }: NavIconState) => <Feather name="home" size={22} color={color} />,
      badge: 3,
    },
    {
      key: 'search',
      label: 'Explore',
      icon: ({ color }: NavIconState) => <Feather name="search" size={22} color={color} />,
    },
    {
      key: 'add',
      label: 'Create',
      icon: ({ color }: NavIconState) => <Feather name="plus" size={22} color={color} />,
    },
    {
      key: 'inbox',
      label: 'Inbox',
      icon: ({ color }: NavIconState) => <Feather name="inbox" size={22} color={color} />,
      badge: 12,
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: ({ color }: NavIconState) => <Feather name="user" size={22} color={color} />,
    },
  ];

  return (
    <View className="gap-6">
      <Section title="Bottom Navigation" subtitle="iOS/Android style tab bar">
        <View className="rounded-xl overflow-hidden border border-border">
          <BottomNav items={navItems} value={activeNav} onValueChange={setActiveNav} />
        </View>
      </Section>

      <Section title="Floating Bottom Nav" subtitle="Modern floating pill style">
        <FloatingBottomNav
          items={navItems.slice(0, 4)}
          value={activeNav}
          onValueChange={setActiveNav}
        />
      </Section>

      <Section title="Header" subtitle="App header with actions">
        <View className="rounded-xl overflow-hidden border border-border">
          <Header
            title="Settings"
            subtitle="Manage your preferences"
            leftAction={<HeaderBackButton label="Back" onPress={() => {}} />}
            rightActions={[
              {
                key: 'search',
                accessibilityLabel: 'Search',
                icon: <Feather name="search" size={20} color={colors.foreground} />,
                onPress: () => {},
              },
              {
                key: 'more',
                accessibilityLabel: 'More',
                icon: <Feather name="more-horizontal" size={20} color={colors.foreground} />,
                onPress: () => {},
              },
            ]}
          />
        </View>
      </Section>

      <Section title="Page Header" subtitle="A screen's own heading: kicker, mark, actions, back">
        <PageHeader
          kicker="Weekend in Kyoto"
          title="Settle up"
          description="Three payments clear the group."
          onBack={() => {}}
          mark={
            <Avatar size="sm">
              <AvatarFallback>KY</AvatarFallback>
            </Avatar>
          }
          actions={
            <Button size="sm" variant="outline">
              <ButtonText>Share</ButtonText>
            </Button>
          }
        />
      </Section>

      <Section title="Tab Bar" subtitle="Content filtering tabs">
        <TabBar items={TAB_BAR_ITEMS} value={activeTabBar} onValueChange={setActiveTabBar} />
      </Section>

      <Section title="Tab Bar — Pills" subtitle="Pill-style variant">
        <TabBar
          items={TAB_BAR_ITEMS}
          value={activeTabBar}
          onValueChange={setActiveTabBar}
          variant="pills"
        />
      </Section>
    </View>
  );
}
