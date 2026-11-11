import { useEffect, useState } from 'react';
import { FIRING_PEAK, FIRING_STAGES, FIRING_START } from './data';

const DEGREES_PER_TICK = 7;
const TICK_MS = 1000;
const CLIMB_TICKS = Math.ceil((FIRING_PEAK - FIRING_START) / DEGREES_PER_TICK);
const HOLD_TICKS = 8;
/** Real kilns climb about 2.5°C a minute near peak. */
const DEGREES_PER_MINUTE = 2.5;

export interface LiveFiring {
  temp: number;
  atPeak: boolean;
  stageIndex: number;
  minutesToPeak: number;
}

/**
 * A simulated cone 10 glaze firing that climbs, holds at peak, then starts over.
 * One instance drives the whole app so every screen reads the same kiln.
 */
export function useLiveFiring(): LiveFiring {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setTick((t) => (t >= CLIMB_TICKS + HOLD_TICKS ? 0 : t + 1)),
      TICK_MS
    );
    return () => clearInterval(id);
  }, []);

  const temp = Math.min(FIRING_PEAK, FIRING_START + tick * DEGREES_PER_TICK);
  const atPeak = temp >= FIRING_PEAK;
  const stageIndex = FIRING_STAGES.findLastIndex((stage) => temp >= stage.from);

  return {
    temp,
    atPeak,
    stageIndex,
    minutesToPeak: Math.ceil((FIRING_PEAK - temp) / DEGREES_PER_MINUTE),
  };
}

export function formatTemp(celsius: number) {
  return `${celsius.toLocaleString('en-US')}°C`;
}
