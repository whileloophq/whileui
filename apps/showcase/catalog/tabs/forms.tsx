import { useState } from 'react';
import { Modal, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  Button,
  ButtonText,
  Checkbox,
  DatePickerInline,
  DatePickerModal,
  DatePickerTrigger,
  type DateRange,
  DateRangePickerModal,
  DateRangePickerTrigger,
  FormControl,
  FormField,
  FormHint,
  FormLabel,
  FormMessage,
  FormModalScreen,
  Input,
  Label,
  LabeledField,
  LabeledFieldControl,
  NumericInput,
  Switch,
  Text,
  Textarea,
  TimePickerModal,
  TimePickerTrigger,
  useIconColors,
  useToast,
} from '@thewhileloop/whileui';
import { Section } from '../ui';

export function FormsBlocksTab() {
  const [email, setEmail] = useState('');
  const [weight, setWeight] = useState<number | null>(72.4);
  const [budget, setBudget] = useState<number | null>(2500);
  const [checkVal, setCheckVal] = useState(false);
  const [switchVal, setSwitchVal] = useState(true);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formSaving, setFormSaving] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dateRangePickerOpen, setDateRangePickerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null);
  const { toast } = useToast();
  const colors = useIconColors();

  const emailInvalid = email.length > 0 && !email.includes('@');

  return (
    <View className="gap-6">
      <Section
        title="Form Controls"
        subtitle="FormField, Input, NumericInput, LabeledField, and compact composition"
      >
        <FormField required invalid={emailInvalid}>
          <FormLabel>Work Email</FormLabel>
          <FormControl>
            <Input
              placeholder="you@company.com"
              value={email}
              onChangeText={setEmail}
              variant={emailInvalid ? 'error' : 'default'}
            />
          </FormControl>
          {emailInvalid ? (
            <FormMessage>Please enter a valid email address.</FormMessage>
          ) : (
            <FormHint>We'll send invoices and account alerts to this email.</FormHint>
          )}
        </FormField>

        <FormField density="compact">
          <FormLabel>Weight</FormLabel>
          <FormControl>
            <NumericInput
              size="compact"
              value={weight}
              min={0}
              max={300}
              step={0.1}
              showSteppers
              onValueChange={setWeight}
              suffix={<Text className="text-xs text-muted-foreground">kg</Text>}
            />
          </FormControl>
          <FormHint>Supports prefix/suffix slots and optional steppers.</FormHint>
        </FormField>

        <LabeledField
          label="Monthly Budget"
          hint="Used for alerts and spending caps"
          leftSlot={<Feather name="dollar-sign" size={16} color={colors.muted} />}
          rightSlot={<Text className="text-xs text-muted-foreground">USD</Text>}
        >
          <LabeledFieldControl>
            <NumericInput value={budget} onValueChange={setBudget} min={0} step={50} unstyled />
          </LabeledFieldControl>
        </LabeledField>

        <FormField>
          <FormLabel>Notes</FormLabel>
          <FormControl>
            <Textarea placeholder="Write something great..." />
          </FormControl>
        </FormField>

        <View className="flex-row items-center gap-6">
          <View className="flex-row items-center gap-2">
            <Checkbox
              checked={checkVal}
              onCheckedChange={setCheckVal}
              accessibilityLabel="Terms & Privacy"
            />
            <Label onPress={() => setCheckVal(!checkVal)}>Terms & Privacy</Label>
          </View>
          <View className="flex-row items-center gap-2">
            <Switch
              checked={switchVal}
              onCheckedChange={setSwitchVal}
              accessibilityLabel="Notify me"
            />
            <Label onPress={() => setSwitchVal(!switchVal)}>Notify me</Label>
          </View>
        </View>
      </Section>

      <Section
        title="Date Picker Modal"
        subtitle="Compact trigger opens bottom sheet with calendar"
      >
        <DatePickerModal
          value={selectedDate}
          onValueChange={(d) => {
            setSelectedDate(d);
            if (d) toast({ title: 'Date selected', description: d });
          }}
          open={datePickerOpen}
          onOpenChange={setDatePickerOpen}
          trigger={<DatePickerTrigger value={selectedDate} placeholder="Pick a date" />}
          title="Select date"
        />
      </Section>

      <Section title="Time Picker Modal" subtitle="Hour and minute wheels in the same sheet">
        <TimePickerModal
          value={selectedTime}
          onValueChange={(t) => {
            setSelectedTime(t);
            if (t) toast({ title: 'Time selected', description: t });
          }}
          open={timePickerOpen}
          onOpenChange={setTimePickerOpen}
          trigger={<TimePickerTrigger value={selectedTime} placeholder="Pick a time" />}
          title="Select time"
        />
      </Section>

      <Section title="Date Picker Inline" subtitle="Embedded calendar for forms or dashboards">
        <DatePickerInline
          value={selectedDate}
          onValueChange={(d) => {
            setSelectedDate(d);
            if (d) toast({ title: 'Date selected', description: d });
          }}
        />
      </Section>

      <Section
        title="Date Range Picker Modal"
        subtitle="Select start and end dates with period marking"
      >
        <DateRangePickerModal
          value={selectedRange}
          onValueChange={(r) => {
            setSelectedRange(r);
            if (r) toast({ title: 'Range selected', description: `${r.start} – ${r.end}` });
          }}
          open={dateRangePickerOpen}
          onOpenChange={setDateRangePickerOpen}
          trigger={<DateRangePickerTrigger value={selectedRange} placeholder="Pick date range" />}
          title="Select date range"
        />
      </Section>

      <Section
        title="Form Modal Screen"
        subtitle="Modal scaffold for forms with header, loading, and saving states"
      >
        <Button onPress={() => setFormModalOpen(true)}>
          <ButtonText>Open Form Modal</ButtonText>
        </Button>
        <Modal
          visible={formModalOpen}
          animationType="slide"
          onRequestClose={() => setFormModalOpen(false)}
        >
          <View style={{ flex: 1 }} className="bg-background">
            <FormModalScreen
              title="Edit Profile"
              subtitle="Update your account details"
              onClose={() => setFormModalOpen(false)}
              saving={formSaving}
              savingText="Saving..."
              scrollEnabled
            >
              <View className="gap-4 pb-8">
                <FormField>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" />
                  </FormControl>
                </FormField>
                <FormField>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jane@example.com" keyboardType="email-address" />
                  </FormControl>
                </FormField>
                <FormField>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input placeholder="Tell us about yourself" />
                  </FormControl>
                  <FormHint>Optional. Shown on your public profile.</FormHint>
                </FormField>
                <Button
                  className="mt-2"
                  onPress={() => {
                    setFormSaving(true);
                    setTimeout(() => {
                      setFormSaving(false);
                      toast({ title: 'Profile updated', variant: 'success' });
                      setFormModalOpen(false);
                    }, 1500);
                  }}
                >
                  <ButtonText>Save Changes</ButtonText>
                </Button>
              </View>
            </FormModalScreen>
          </View>
        </Modal>
      </Section>
    </View>
  );
}
