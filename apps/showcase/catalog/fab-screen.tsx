import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  Button,
  ButtonText,
  Container,
  FAB,
  FABGroup,
  Row,
  Stack,
  Text,
  useIconColors,
  useThemeColors,
} from '@thewhileloop/whileui';

/**
 * FAB demo.
 *
 * A standalone screen rather than a card in the catalog, because a floating action
 * button only behaves like itself over a full-height scrolling surface — pinned while
 * content moves beneath it. Demonstrated in a card it is just a round button.
 */
export function FabScreen({ onClose }: { onClose: () => void }) {
  const icons = useIconColors();
  // `useIconColors` carries primaryForeground but not the secondary or destructive
  // pairs, so an icon on those surfaces has to come from the full theme colours.
  const colors = useThemeColors();
  const [count, setCount] = useState(0);
  const [groupOpen, setGroupOpen] = useState(false);

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerClassName="w-full max-w-5xl self-center p-5">
        <Container size="lg">
          <Stack className="gap-5">
            <Row className="items-center justify-between">
              <Text variant="heading">FAB</Text>
              <Button variant="outline" size="sm" onPress={onClose}>
                <ButtonText>Close</ButtonText>
              </Button>
            </Row>

            <Text className="text-muted-foreground">
              Pressed {count} {count === 1 ? 'time' : 'times'}. Scroll — the button stays put while
              this content moves under it.
            </Text>

            <Stack className="gap-2">
              <Text variant="title">Sizes</Text>
              <Text className="text-muted-foreground">
                48, 56 and 64. Each clears the iOS 44pt and Android 48dp minimum on its own, so a
                FAB never needs hitSlop.
              </Text>
              <Row className="items-center gap-3">
                <FAB label="Small action" size="sm" placement="inline">
                  <Feather name="plus" size={20} color={icons.primaryForeground} />
                </FAB>
                <FAB label="Default action" placement="inline">
                  <Feather name="plus" size={24} color={icons.primaryForeground} />
                </FAB>
                <FAB label="Large action" size="lg" placement="inline">
                  <Feather name="plus" size={28} color={icons.primaryForeground} />
                </FAB>
              </Row>
            </Stack>

            <Stack className="gap-2">
              <Text variant="title">Variants</Text>
              <Row className="items-center gap-3">
                <FAB label="Primary" placement="inline">
                  <Feather name="plus" size={24} color={icons.primaryForeground} />
                </FAB>
                <FAB label="Secondary" variant="secondary" placement="inline">
                  <Feather name="edit-2" size={22} color={colors.secondaryForeground} />
                </FAB>
                <FAB label="Delete" variant="destructive" placement="inline">
                  <Feather name="trash-2" size={22} color={colors.destructiveForeground} />
                </FAB>
                <FAB label="On surface" variant="surface" placement="inline">
                  <Feather name="share-2" size={22} color={icons.foreground} />
                </FAB>
              </Row>
            </Stack>

            <Stack className="gap-2">
              <Text variant="title">Disabled</Text>
              <FAB label="Unavailable" disabled placement="inline">
                <Feather name="plus" size={24} color={icons.primaryForeground} />
              </FAB>
            </Stack>

            {/* Filler so the floating buttons below have something to float over. */}
            {Array.from({ length: 14 }).map((_, i) => (
              <Text key={i} className="text-muted-foreground">
                Row {i + 1}
              </Text>
            ))}
          </Stack>
        </Container>
      </ScrollView>

      {groupOpen ? (
        <FABGroup>
          <FAB label="Add a person" size="sm" variant="surface" placement="inline">
            <Feather name="user-plus" size={20} color={icons.foreground} />
          </FAB>
          <FAB label="Add a note" size="sm" variant="surface" placement="inline">
            <Feather name="file-text" size={20} color={icons.foreground} />
          </FAB>
          <FAB label="Close the menu" onPress={() => setGroupOpen(false)}>
            <Feather name="x" size={24} color={icons.primaryForeground} />
          </FAB>
        </FABGroup>
      ) : (
        <FABGroup>
          <FAB
            label="Open the action menu"
            size="sm"
            variant="surface"
            placement="inline"
            onPress={() => setGroupOpen(true)}
          >
            <Feather name="more-horizontal" size={20} color={icons.foreground} />
          </FAB>
          <FAB label="Add an item" onPress={() => setCount((n) => n + 1)}>
            <Feather name="plus" size={24} color={icons.primaryForeground} />
          </FAB>
        </FABGroup>
      )}
    </View>
  );
}
