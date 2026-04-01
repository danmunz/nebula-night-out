import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage, clearAllData } from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('reads existing value from localStorage', () => {
    localStorage.setItem('nebula_testKey', JSON.stringify('persisted'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));
    expect(result.current[0]).toBe('persisted');
  });

  it('writes value to localStorage on update', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    act(() => {
      result.current[1]('updated');
    });
    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('nebula_testKey')!)).toBe('updated');
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage<number>('count', 0));
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    expect(result.current[0]).toBe(1);
    act(() => {
      result.current[1]((prev) => prev + 5);
    });
    expect(result.current[0]).toBe(6);
  });

  it('works with complex objects', () => {
    const obj = { name: 'Zara', species: 'Nebulari', interests: ['Yoga'] };
    const { result } = renderHook(() => useLocalStorage('profile', obj));
    expect(result.current[0]).toEqual(obj);
  });

  it('works with arrays', () => {
    const { result } = renderHook(() => useLocalStorage<string[]>('ids', []));
    act(() => {
      result.current[1]((prev) => [...prev, 'id-1']);
    });
    expect(result.current[0]).toEqual(['id-1']);
  });

  it('prefixes keys with nebula_', () => {
    const { result } = renderHook(() => useLocalStorage('myKey', 'val'));
    act(() => {
      result.current[1]('newVal');
    });
    expect(localStorage.getItem('nebula_myKey')).toBe('"newVal"');
    expect(localStorage.getItem('myKey')).toBeNull();
  });
});

describe('clearAllData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('removes all nebula_ prefixed keys', () => {
    localStorage.setItem('nebula_apiKey', '"key"');
    localStorage.setItem('nebula_profile', '{}');
    localStorage.setItem('other_key', '"keep"');

    clearAllData();

    expect(localStorage.getItem('nebula_apiKey')).toBeNull();
    expect(localStorage.getItem('nebula_profile')).toBeNull();
    expect(localStorage.getItem('other_key')).toBe('"keep"');
  });

  it('does nothing when no nebula_ keys exist', () => {
    localStorage.setItem('unrelated', '"data"');
    clearAllData();
    expect(localStorage.getItem('unrelated')).toBe('"data"');
  });
});
