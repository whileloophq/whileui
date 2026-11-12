import { useState } from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  Avatar,
  AvatarFallback,
  Button,
  ButtonText,
  cn,
  DataRow,
  DataRowCenter,
  DataRowDescription,
  DataRowLabel,
  DataRowLeft,
  DataRowRight,
  DataRowValue,
  OTPInput,
  RadioGroup,
  RadioGroupItem,
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlItemText,
  Select,
  SelectContent,
  SelectItem,
  SelectItemIcon,
  type SelectOption,
  SelectTrigger,
  SelectValue,
  Text,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  ToggleGroupItemText,
  ToggleText,
  useIconColors,
} from '@thewhileloop/whileui';
import { Section, triggerHaptic } from '../ui';

const LONG_REGIONS = Array.from({ length: 40 }, (_, index) => `Region ${index + 1}`);
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'SGD'];
const LEDGER_TABS = ['Overview', 'Transactions', 'Recurring', 'Statements', 'Settings'];

export function ControlsTab({ onOpenFabScreen }: { onOpenFabScreen: () => void }) {
  const [radioVal, setRadioVal] = useState('option-1');
  const [massUnit, setMassUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [ledgerTab, setLedgerTab] = useState(LEDGER_TABS[0]);
  const [selectVal, setSelectVal] = useState<SelectOption | undefined>(undefined);
  const [regionVal, setRegionVal] = useState<SelectOption | undefined>(undefined);
  const colors = useIconColors();
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 12,
    right: 12,
  };

  return (
    <View>
      <Section
        title="FAB"
        subtitle="A floating action button only behaves like itself over a full screen"
      >
        <Button onPress={onOpenFabScreen}>
          <ButtonText>Open the FAB screen</ButtonText>
        </Button>
      </Section>
      <Section title="Selection" subtitle="SegmentedControl, radios, selects, and toggles">
        <SegmentedControl value={massUnit} onValueChange={setMassUnit} wrap={false}>
          <SegmentedControlItem value="kg">
            <SegmentedControlItemText>kg</SegmentedControlItemText>
          </SegmentedControlItem>
          <SegmentedControlItem value="lbs">
            <SegmentedControlItemText>lbs</SegmentedControlItemText>
          </SegmentedControlItem>
        </SegmentedControl>
        <SegmentedControl value={heightUnit} onValueChange={setHeightUnit} wrap={false}>
          <SegmentedControlItem value="cm">
            <SegmentedControlItemText>Centimeters</SegmentedControlItemText>
          </SegmentedControlItem>
          <SegmentedControlItem value="in">
            <SegmentedControlItemText>Inches</SegmentedControlItemText>
          </SegmentedControlItem>
          <SegmentedControlItem value="ft">
            <SegmentedControlItemText>Feet</SegmentedControlItemText>
          </SegmentedControlItem>
        </SegmentedControl>
        <View>
          <Text className="mb-2 text-sm text-muted-foreground">Pill variant</Text>
          <SegmentedControl
            variant="pill"
            value={massUnit}
            onValueChange={setMassUnit}
            wrap={false}
          >
            <SegmentedControlItem value="kg">
              <SegmentedControlItemText>kg</SegmentedControlItemText>
            </SegmentedControlItem>
            <SegmentedControlItem value="lbs">
              <SegmentedControlItemText>lbs</SegmentedControlItemText>
            </SegmentedControlItem>
          </SegmentedControl>
        </View>
        <View>
          <Text className="mb-2 text-sm text-muted-foreground">
            Scrolls sideways when the labels do not fit
          </Text>
          <SegmentedControl value={ledgerTab} onValueChange={setLedgerTab} wrap="scroll">
            {LEDGER_TABS.map((tab) => (
              <SegmentedControlItem key={tab} value={tab}>
                <SegmentedControlItemText>{tab}</SegmentedControlItemText>
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </View>
        <RadioGroup value={radioVal} onValueChange={setRadioVal}>
          <RadioGroupItem value="option-1" label="Free plan" />
          <RadioGroupItem value="option-2" label="Pro plan" description="Billed monthly" />
        </RadioGroup>
        <Select value={selectVal} onValueChange={(opt) => setSelectVal(opt)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a framework" />
          </SelectTrigger>
          <SelectContent insets={contentInsets} className="w-full">
            <SelectItem label="React Native" value="rn">
              <SelectItemIcon>
                <Feather name="smartphone" size={16} color={colors.foreground} />
              </SelectItemIcon>
            </SelectItem>
            <SelectItem label="Flutter" value="flutter">
              <SelectItemIcon>
                <Feather name="zap" size={16} color={colors.foreground} />
              </SelectItemIcon>
            </SelectItem>
            <SelectItem label="SwiftUI" value="swift">
              <SelectItemIcon>
                <Feather name="box" size={16} color={colors.foreground} />
              </SelectItemIcon>
            </SelectItem>
            <SelectItem label="React Native for desktop and embedded devices" value="rn-extended">
              <SelectItemIcon>
                <Feather name="monitor" size={16} color={colors.foreground} />
              </SelectItemIcon>
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={regionVal} onValueChange={(opt) => setRegionVal(opt)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a region (long list)" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {LONG_REGIONS.map((region) => (
              <SelectItem key={region} label={region} value={region} />
            ))}
          </SelectContent>
        </Select>
        <View className="flex-row flex-wrap gap-4">
          <Toggle>
            <ToggleText>Bold</ToggleText>
          </Toggle>
          <ToggleGroup type="single">
            <ToggleGroupItem value="left">
              <ToggleGroupItemText>L</ToggleGroupItemText>
            </ToggleGroupItem>
            <ToggleGroupItem value="center">
              <ToggleGroupItemText>C</ToggleGroupItemText>
            </ToggleGroupItem>
            <ToggleGroupItem value="right">
              <ToggleGroupItemText>R</ToggleGroupItemText>
            </ToggleGroupItem>
          </ToggleGroup>
        </View>
        {/* Chips that wrap: a single-choice group with `flex-wrap`. */}
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          defaultValue="USD"
          accessibilityLabel="Currency"
          className="flex-wrap"
        >
          {CURRENCIES.map((code) => (
            <ToggleGroupItem key={code} value={code}>
              <ToggleGroupItemText>{code}</ToggleGroupItemText>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Section>

      <Section title="Data Row" subtitle="Reusable left/center/right rows with narrow-width safety">
        <View className="rounded-xl border border-border p-3 gap-2">
          {/* With `onPress` the row is one button: role, pressed state and focus ring. */}
          <DataRow
            className="border-b border-border px-1 pb-3"
            onPress={() => triggerHaptic('light')}
          >
            <DataRowLeft>
              <Avatar size="sm">
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
            </DataRowLeft>
            <DataRowCenter>
              <DataRowLabel>Alex Lee</DataRowLabel>
              <DataRowDescription>Lead Product Designer</DataRowDescription>
            </DataRowCenter>
            <DataRowRight>
              <DataRowValue>Owner</DataRowValue>
            </DataRowRight>
          </DataRow>
          {/* `disabled` keeps it a button but stops it firing — for a row whose action is busy. */}
          <DataRow className="border-b border-border px-1 pb-3" onPress={() => {}} disabled>
            <DataRowCenter>
              <DataRowLabel>Export history</DataRowLabel>
              <DataRowDescription>Preparing the file…</DataRowDescription>
            </DataRowCenter>
          </DataRow>
          <View className="w-64">
            <DataRow size="compact" className="px-1">
              <DataRowLeft>
                <Feather name="activity" size={16} color={colors.muted} />
              </DataRowLeft>
              <DataRowCenter>
                <DataRowLabel>Average Session Duration</DataRowLabel>
                <DataRowDescription>
                  This label truncates safely on narrow screens.
                </DataRowDescription>
              </DataRowCenter>
              <DataRowRight>
                <DataRowValue>12m 48s</DataRowValue>
              </DataRowRight>
            </DataRow>
          </View>
        </View>
      </Section>

      <Section title="OTP Input" subtitle="Verification code entry with auto-focus and paste">
        <OTPInputDemo />
      </Section>
    </View>
  );
}

function OTPInputDemo() {
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');

  return (
    <View className="gap-4">
      <OTPInput
        value={otp}
        onValueChange={(v) => {
          setOtp(v);
          if (status !== 'idle') setStatus('idle');
        }}
        onComplete={(code) => {
          // Stays until the next edit. A timeout here races the native OTP flow.
          setStatus(code === '123456' ? 'success' : 'error');
        }}
        variant={status === 'error' ? 'error' : 'default'}
      />
      <Text
        className={cn(
          'text-center text-sm',
          status === 'error'
            ? 'text-destructive'
            : status === 'success'
              ? 'text-success'
              : 'text-muted-foreground'
        )}
      >
        {status === 'error'
          ? 'Invalid code — try 123456'
          : status === 'success'
            ? 'Code verified!'
            : 'Enter code (try 123456)'}
      </Text>
      <SecurePinDemo />
    </View>
  );
}

function SecurePinDemo() {
  const [pin, setPin] = useState('');
  const [pinOk, setPinOk] = useState(false);

  return (
    <View className="items-center gap-2">
      <Text className="text-xs text-muted-foreground">Secure (4-digit PIN — try 0000)</Text>
      <OTPInput
        length={4}
        secure
        size="compact"
        value={pin}
        onValueChange={(v) => {
          setPin(v);
          setPinOk(false);
        }}
        onComplete={(code) => {
          if (code === '0000') setPinOk(true);
        }}
      />
      {pinOk && <Text className="text-xs text-success">PIN accepted</Text>}
    </View>
  );
}
