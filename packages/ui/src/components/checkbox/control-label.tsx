import { View } from 'react-native';
import { Text } from '../text';

/**
 * The text half of a labelled `Checkbox` or `Switch`. It renders inside the control's own
 * pressable, so the row is one element: a screen reader reads one checkbox named by
 * this text, and pressing the text toggles it. A label composed beside the control is
 * either a second element or, wrapped in another pressable, a checkbox inside a checkbox.
 */
export function ControlLabel({ label, description }: { label: string; description?: string }) {
  return (
    <View className="min-w-0 flex-1 gap-0.5">
      <Text variant="label">{label}</Text>
      {description ? <Text variant="caption">{description}</Text> : null}
    </View>
  );
}
