import { act, renderHook } from '@testing-library/react-native';
import { useDebouncedSearch } from './use-debounced-search';

describe('useDebouncedSearch', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('returns the trimmed query once typing pauses', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedSearch(value),
      { initialProps: { value: '' } }
    );
    await rerender({ value: '  kyoto ' });
    expect(result.current).toBe('');

    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('kyoto');
  });

  it('is empty under the minimum length, so one letter does not query', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebouncedSearch(value, { minLength: 2 }),
      { initialProps: { value: 'ky' } }
    );
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('ky');

    await rerender({ value: 'k' });
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('');
  });
});
