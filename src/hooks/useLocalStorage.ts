import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem('nebula_' + key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const nextValue = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem('nebula_' + key, JSON.stringify(nextValue));
      } catch { /* quota exceeded — silently fail */ }
      return nextValue;
    });
  }, [key]);

  return [storedValue, setValue];
}

export function clearAllData() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('nebula_'));
  keys.forEach(k => localStorage.removeItem(k));
}
