---
'@thewhileloop/whileui': minor
---

Add `TimePickerModal` and `TimePickerTrigger`, the time half of `DatePickerModal`.

A form with a date field almost always has a time field beside it, and until now that
second field was a typed `HH:MM` box — a consuming app shipped exactly that. The picker
is two wheels (three with AM/PM) in the same bottom sheet as the date picker, so both
fields open the same way.

```tsx
<TimePickerModal
  value={time}
  onValueChange={setTime}
  open={open}
  onOpenChange={setOpen}
  trigger={<TimePickerTrigger value={time} placeholder="Pick a time" />}
/>
```

`value` is always `HH:MM` in 24-hour form; `hourCycle` chooses the wheels (12-hour with
AM/PM, or 24-hour) and defaults to the device locale's clock. `minuteStep` coarsens the
minute wheel. Each wheel is one `adjustable` element for VoiceOver, TalkBack and the
keyboard, so sixty minute rows never become sixty tab stops.
