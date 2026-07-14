import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';

describe('useGlobalSearch', () => {
  it('returns empty results for an empty query', () => {
    const { result } = renderHook(() => useGlobalSearch());
    expect(result.current.searchResults).toHaveLength(0);
    expect(result.current.hasResults).toBe(false);
  });

  it('returns results when a query matches global data', () => {
    const { result } = renderHook(() => useGlobalSearch());
    act(() => {
      result.current.setSearchQuery('windrose');
    });
    expect(result.current.searchResults.length).toBeGreaterThan(0);
    expect(result.current.hasResults).toBe(true);
  });

  it('returns empty results when query does not match anything', () => {
    const { result } = renderHook(() => useGlobalSearch());
    act(() => {
      result.current.setSearchQuery('zzzzzznotaresult12345');
    });
    expect(result.current.searchResults).toHaveLength(0);
  });

  it('caps results at 8 items', () => {
    const { result } = renderHook(() => useGlobalSearch());
    act(() => {
      // Single character query likely matches many items
      result.current.setSearchQuery('a');
    });
    expect(result.current.searchResults.length).toBeLessThanOrEqual(8);
  });
});
