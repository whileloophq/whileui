import React from 'react';
import { View } from 'react-native';
import { Separator, Text, cn } from '@thewhileloop/whileui';
import { FIRING_STAGES } from './data';
import { mono } from './fonts';
import { formatTemp } from './use-live-firing';

/** The stages as a ruled list: past stages fade, the current one is marked in the margin. */
export function FiringSchedule({ stageIndex }: { stageIndex: number }) {
  return (
    <View>
      {FIRING_STAGES.map((stage, i) => {
        const done = i < stageIndex;
        const current = i === stageIndex;
        return (
          <View key={stage.key}>
            {i > 0 ? <Separator /> : null}
            <View
              accessible
              accessibilityLabel={`${stage.label}, ${done ? 'done' : current ? 'now' : 'next'}`}
              className="flex-row items-center gap-4 py-3.5"
            >
              <View
                className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  current ? 'bg-primary' : done ? 'bg-foreground/30' : 'border border-border'
                )}
              />
              <View className="flex-1">
                <Text
                  className={cn(
                    'text-base font-semibold',
                    done ? 'text-muted-foreground' : 'text-foreground'
                  )}
                >
                  {stage.label}
                </Text>
                <Text className="text-sm text-muted-foreground">{stage.detail}</Text>
              </View>
              <Text
                className={cn('text-xs', current ? 'text-primary' : 'text-muted-foreground')}
                style={mono}
              >
                {stage.from === 0 ? 'START' : formatTemp(stage.from)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
