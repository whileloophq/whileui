import { useState } from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  BottomNav,
  FloatingBottomNav,
  Header,
  HeaderBackButton,
  TabBar,
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
      icon: <Feather name="home" size={22} color={colors.muted} />,
      badge: 3,
    },
    {
      key: 'search',
      label: 'Explore',
      icon: <Feather name="search" size={22} color={colors.muted} />,
    },
    {
      key: 'add',
      label: 'Create',
      icon: <Feather name="plus" size={22} color={colors.muted} />,
    },
    {
      key: 'inbox',
      label: 'Inbox',
      icon: <Feather name="inbox" size={22} color={colors.muted} />,
      badge: 12,
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: <Feather name="user" size={22} color={colors.muted} />,
    },
  ];

  return (
    <View className="gap-6">
      <Section title="Bottom Navigation" subtitle="iOS/Android style tab bar">
        <View className="rounded-xl overflow-hidden border border-border">
          <BottomNav items={navItems} activeKey={activeNav} onSelect={setActiveNav} />
        </View>
      </Section>

      <Section title="Floating Bottom Nav" subtitle="Modern floating pill style">
        <FloatingBottomNav
          items={navItems.slice(0, 4)}
          activeKey={activeNav}
          onSelect={setActiveNav}
        />
      </Section>

      <Section title="Header" subtitle="App header with actions">
        <View className="rounded-xl overflow-hidden border border-border">
          <Header
            title="Settings"
            subtitle="Manage your preferences"
            leftAction={<HeaderBackButton label="Back" />}
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

      <Section title="Tab Bar" subtitle="Content filtering tabs">
        <TabBar items={TAB_BAR_ITEMS} activeKey={activeTabBar} onSelect={setActiveTabBar} />
      </Section>

      <Section title="Tab Bar — Pills" subtitle="Pill-style variant">
        <TabBar
          items={TAB_BAR_ITEMS}
          activeKey={activeTabBar}
          onSelect={setActiveTabBar}
          variant="pills"
        />
      </Section>
    </View>
  );
}
