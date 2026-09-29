import { AccessibilityInfo, Text } from 'react-native';
import { ReduceMotion } from 'react-native-reanimated';
import { render as rntlRender } from '@testing-library/react-native';
import { act, render, screen } from '../test/render';
import {
  MotionProvider,
  useMotionPolicy,
  type MotionMode,
  type MotionPolicy,
} from './motion-policy';

function PolicyProbe() {
  const policy = useMotionPolicy();
  return (
    <Text testID="policy">
      {JSON.stringify({
        mode: policy.mode,
        reduceMotion: policy.reduceMotion,
        animationsEnabled: policy.animationsEnabled,
        durations: policy.durations,
        springs: policy.springs,
        reanimatedReduceMotion: policy.reanimatedReduceMotion,
      })}
    </Text>
  );
}

async function renderPolicy(mode: MotionMode) {
  await render(
    <MotionProvider mode={mode}>
      <PolicyProbe />
    </MotionProvider>
  );
  return JSON.parse(screen.getByTestId('policy').props.children as string) as {
    mode: MotionMode;
    reduceMotion: boolean;
    animationsEnabled: boolean;
    durations: { fast: number; normal: number; slow: number };
    springs: MotionPolicy['springs'];
    reanimatedReduceMotion: ReduceMotion;
  };
}

describe('MotionProvider', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uses full motion when explicitly requested', async () => {
    const policy = await renderPolicy('full');

    expect(policy).toMatchObject({
      mode: 'full',
      reduceMotion: false,
      animationsEnabled: true,
      durations: { fast: 140, normal: 200, slow: 280 },
      springs: {
        responsive: {
          damping: 20,
          stiffness: 260,
          mass: 0.8,
          reduceMotion: ReduceMotion.Never,
        },
      },
      reanimatedReduceMotion: ReduceMotion.Never,
    });
  });

  it('marks motion as reduced without disabling non-spatial animation', async () => {
    const policy = await renderPolicy('reduced');

    expect(policy).toMatchObject({
      reduceMotion: true,
      animationsEnabled: true,
      durations: { fast: 140, normal: 200, slow: 280 },
      reanimatedReduceMotion: ReduceMotion.Always,
    });
  });

  it('makes animation deterministic when disabled for tests', async () => {
    const policy = await renderPolicy('disabled');

    expect(policy).toMatchObject({
      reduceMotion: true,
      animationsEnabled: false,
      durations: { fast: 0, normal: 0, slow: 0 },
      reanimatedReduceMotion: ReduceMotion.Always,
    });
  });

  it('follows changes to the system reduced-motion setting', async () => {
    let listener: ((enabled: boolean) => void) | undefined;
    const remove = jest.fn();
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation(((
      _event: string,
      callback: (enabled: boolean) => void
    ) => {
      listener = callback;
      return { remove } as never;
    }) as never);

    const result = await render(
      <MotionProvider>
        <PolicyProbe />
      </MotionProvider>
    );
    expect(JSON.parse(screen.getByTestId('policy').props.children as string)).toMatchObject({
      mode: 'system',
      reduceMotion: false,
      reanimatedReduceMotion: ReduceMotion.System,
    });

    await act(() => {
      listener?.(true);
    });

    expect(JSON.parse(screen.getByTestId('policy').props.children as string)).toMatchObject({
      reduceMotion: true,
    });

    await result.unmount();
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('falls back to the default policy without a provider', async () => {
    await rntlRender(<PolicyProbe />);

    expect(JSON.parse(screen.getByTestId('policy').props.children as string)).toMatchObject({
      mode: 'system',
      reduceMotion: false,
      animationsEnabled: true,
      durations: { fast: 140, normal: 200, slow: 280 },
      reanimatedReduceMotion: ReduceMotion.System,
    });
  });

  it('keeps the policy object stable when its inputs do not change', async () => {
    const observed: MotionPolicy[] = [];
    function Observer() {
      const policy = useMotionPolicy();
      observed.push(policy);
      return null;
    }
    const tree = (
      <MotionProvider mode="full">
        <Observer />
      </MotionProvider>
    );
    const result = await render(tree);
    const firstPolicy = observed.at(-1);

    await result.rerender(tree);

    expect(observed.at(-1)).toBe(firstPolicy);
  });
});
