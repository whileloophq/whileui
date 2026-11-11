import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Badge,
  BadgeText,
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlItemText,
  Separator,
  Text,
} from '@thewhileloop/whileui';
import { FIRING_LOG, type FiringKind } from '../data';
import { FiringCurve } from '../firing-curve';
import { FiringSchedule } from '../firing-schedule';
import { mono } from '../fonts';
import { Eyebrow, GUTTER, Reveal, ScreenHeader, SectionHeader } from '../ui';
import type { LiveFiring } from '../use-live-firing';

type Filter = 'all' | FiringKind;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'bisque', label: 'Bisque' },
  { value: 'glaze', label: 'Glaze' },
  { value: 'raku', label: 'Raku' },
];

export function FiringsScreen({ firing }: { firing: LiveFiring }) {
  const [filter, setFilter] = useState<Filter>('all');
  const entries = FIRING_LOG.filter((entry) => filter === 'all' || entry.kind === filter);

  return (
    <View>
      <ScreenHeader title="Firings" subtitle="Every load through the studio kilns." />

      <Reveal order={0}>
        <View className="mt-6" style={{ paddingHorizontal: GUTTER }}>
          <Eyebrow>Tonight · Kiln 2</Eyebrow>
          <View className="mt-3">
            <FiringCurve temp={firing.temp} />
          </View>
        </View>
      </Reveal>

      <Reveal order={1}>
        <SectionHeader title="History" />
        <View style={{ paddingHorizontal: GUTTER }}>
          <SegmentedControl
            value={filter}
            onValueChange={(next) => setFilter(next as Filter)}
            wrap={false}
          >
            {FILTERS.map((f) => (
              <SegmentedControlItem key={f.value} value={f.value}>
                <SegmentedControlItemText>{f.label}</SegmentedControlItemText>
              </SegmentedControlItem>
            ))}
          </SegmentedControl>

          <View className="mt-2">
            {entries.map((entry, i) => (
              <View key={entry.id}>
                {i > 0 ? <Separator /> : null}
                <View className="flex-row gap-4 py-4">
                  <Text className="w-20 pt-1 text-xs text-muted-foreground" style={mono}>
                    {entry.when.toUpperCase()}
                  </Text>
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-foreground">{entry.title}</Text>
                    <Text className="mt-0.5 text-sm text-muted-foreground">{entry.detail}</Text>
                  </View>
                  {entry.id === 'tonight' ? (
                    <Badge className="self-start">
                      <BadgeText>Live</BadgeText>
                    </Badge>
                  ) : null}
                </View>
              </View>
            ))}
            {entries.length === 0 ? (
              <Text className="py-6 text-sm text-muted-foreground">
                No firings of this kind yet.
              </Text>
            ) : null}
          </View>
        </View>
      </Reveal>

      <Reveal order={2}>
        <SectionHeader title="Tonight's schedule" />
        <View style={{ paddingHorizontal: GUTTER }}>
          <FiringSchedule stageIndex={firing.stageIndex} />
        </View>
      </Reveal>
    </View>
  );
}
