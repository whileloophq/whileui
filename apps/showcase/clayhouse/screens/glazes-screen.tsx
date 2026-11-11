import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  Badge,
  BadgeText,
  Button,
  ButtonText,
  Input,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  Text,
  ToggleGroup,
  ToggleGroupItem,
  ToggleGroupItemText,
  UsageBar,
  cn,
  focusRing,
  useIconColors,
  useToast,
} from '@thewhileloop/whileui';
import { GLAZES, images, type Glaze, type GlazeFamily } from '../data';
import { mono } from '../fonts';
import { GUTTER, Reveal, Scrim, ScreenHeader } from '../ui';

type Filter = 'all' | GlazeFamily;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'celadon', label: 'Celadon' },
  { value: 'iron', label: 'Iron' },
  { value: 'shino', label: 'Shino' },
];

const LOW_STOCK = 20;

function BucketLevel({ stock }: { stock: number }) {
  const low = stock < LOW_STOCK;
  return (
    <View className="mt-2 flex-row items-center gap-2">
      <View className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/10">
        <View
          className={cn('h-full rounded-full', low ? 'bg-warning' : 'bg-accent')}
          style={{ width: `${stock}%` }}
        />
      </View>
      <Text className={cn('text-xs', low ? 'text-warning' : 'text-muted-foreground')} style={mono}>
        {stock}%
      </Text>
    </View>
  );
}

function FeaturedGlaze({ glaze, onPress }: { glaze: Glaze; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${glaze.name}, featured glaze, ${glaze.price} a pint`}
      onPress={onPress}
      className={cn('h-96 overflow-hidden rounded-xl active:opacity-90', focusRing)}
    >
      <Image
        source={images[glaze.image]}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        className="absolute inset-0 h-full w-full"
      />
      <Scrim edge="bottom" height={180} tone="shade" />
      <View className="flex-1 justify-between p-5">
        <View className="self-start rounded-md bg-background/90 px-2.5 py-1">
          <Text className="text-xs uppercase tracking-widest text-foreground" style={mono}>
            Glaze of the week
          </Text>
        </View>
        <View>
          <Text className="text-5xl font-bold text-white">{glaze.name}</Text>
          <Text className="mt-1 text-base text-white/85">{glaze.note}</Text>
          <Text className="mt-3 text-xs text-white/70" style={mono}>
            {`${glaze.cone} · ${glaze.atmosphere} · ${glaze.price} / pint`.toUpperCase()}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function GlazeTile({ glaze, onPress }: { glaze: Glaze; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${glaze.name}, ${glaze.price} a pint, bucket ${glaze.stock}% full`}
      onPress={onPress}
      className={cn('w-[48%] rounded-xl active:opacity-80', focusRing)}
    >
      <Image
        source={images[glaze.image]}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        className="h-48 w-full rounded-xl"
      />
      <View className="mt-3 flex-row items-baseline justify-between">
        <Text className="text-2xl font-bold text-foreground">{glaze.name}</Text>
        <Text className="text-sm text-muted-foreground">{glaze.price}</Text>
      </View>
      <Text className="text-sm text-muted-foreground">{glaze.cone}</Text>
      <BucketLevel stock={glaze.stock} />
    </Pressable>
  );
}

function GlazeSheet({ glaze, onClose }: { glaze: Glaze | null; onClose: () => void }) {
  const { toast } = useToast();
  return (
    <Sheet open={glaze !== null} onOpenChange={(open) => !open && onClose()}>
      {glaze ? (
        <>
          <SheetHeader title={glaze.name} description={`${glaze.cone} · ${glaze.atmosphere}`} />
          <SheetContent>
            <Image
              source={images[glaze.image]}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
              className="h-48 w-full rounded-lg"
            />
            <Text className="mt-4 text-lg text-foreground">{glaze.note}</Text>
            <View className="mt-3 flex-row gap-2">
              <Badge variant="outline">
                <BadgeText>{glaze.cone}</BadgeText>
              </Badge>
              <Badge variant="outline">
                <BadgeText>{glaze.atmosphere}</BadgeText>
              </Badge>
            </View>
            <UsageBar
              className="mt-5"
              label="Bucket level"
              used={glaze.stock}
              limit={100}
              variant={glaze.stock < LOW_STOCK ? 'warning' : 'default'}
            />
          </SheetContent>
          <SheetFooter>
            <Button
              onPress={() => {
                onClose();
                toast({ title: `${glaze.name} reserved`, description: 'A pint is on your shelf.' });
              }}
            >
              <ButtonText>Reserve a pint · {glaze.price}</ButtonText>
            </Button>
          </SheetFooter>
        </>
      ) : null}
    </Sheet>
  );
}

export function GlazesScreen() {
  const colors = useIconColors();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Glaze | null>(null);

  const needle = query.trim().toLowerCase();
  const [featured, ...rest] = GLAZES.filter(
    (g) => (filter === 'all' || g.family === filter) && g.name.toLowerCase().includes(needle)
  );

  return (
    <View>
      <ScreenHeader title="Glazes" subtitle="The shared buckets, and how full they are." />

      <Reveal order={0}>
        <View className="mt-6 gap-3" style={{ paddingHorizontal: GUTTER }}>
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="Search glazes"
            accessibilityLabel="Search glazes"
            prefix={<Feather name="search" size={16} color={colors.muted} />}
          />
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={filter}
            onValueChange={(next) => setFilter((next || 'all') as Filter)}
          >
            {FILTERS.map((f) => (
              <ToggleGroupItem key={f.value} value={f.value}>
                <ToggleGroupItemText>{f.label}</ToggleGroupItemText>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </View>
      </Reveal>

      <Reveal order={1}>
        <View className="mt-6 gap-6" style={{ paddingHorizontal: GUTTER }}>
          {featured ? (
            <FeaturedGlaze glaze={featured} onPress={() => setSelected(featured)} />
          ) : (
            <Text className="text-sm text-muted-foreground">Nothing matches “{query}”.</Text>
          )}
          {rest.length > 0 ? (
            <View className="flex-row flex-wrap justify-between gap-y-6">
              {rest.map((g) => (
                <GlazeTile key={g.id} glaze={g} onPress={() => setSelected(g)} />
              ))}
            </View>
          ) : null}
        </View>
      </Reveal>

      <Reveal order={2}>
        <View className="mt-12" style={{ paddingHorizontal: GUTTER }}>
          <Image
            source={images.glazeBuckets}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            className="h-44 w-full rounded-xl"
          />
          <Text
            className="mt-4 text-xs uppercase tracking-widest text-muted-foreground"
            style={mono}
          >
            Mix day · Saturday 10:00
          </Text>
          <Text className="mt-1 text-3xl font-bold text-foreground">
            New buckets, weighed together
          </Text>
          <Text className="mt-1 text-base text-muted-foreground">
            Bring a test tile. Whatever runs low this week gets mixed first.
          </Text>
        </View>
      </Reveal>

      <GlazeSheet glaze={selected} onClose={() => setSelected(null)} />
    </View>
  );
}
