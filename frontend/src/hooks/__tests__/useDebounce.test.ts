import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('应返回初始值', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('应在延迟后更新值', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    // 更新值
    rerender({ value: 'updated' });

    // 立即检查 - 应该还是旧值
    expect(result.current).toBe('initial');

    // 快进时间
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // 应该更新为新值
    expect(result.current).toBe('updated');
  });

  it('延迟期间多次更新应只触发一次', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'v1' } }
    );

    rerender({ value: 'v2' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'v3' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'v4' });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('v4'); // 应该是最后一次的值
  });

  it('组件卸载时应清理 timer', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useDebounce('test', 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
