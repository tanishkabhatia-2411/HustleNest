import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage - Custom hook for localStorage with React state sync
 * 
 * Usage:
 *   const [value, setValue] = useLocalStorage('myKey', defaultValue);
 * 
 * Why: Avoids duplicating localStorage read/write logic in multiple components.
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`useLocalStorage: Error reading key "${key}"`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        // Support functional updater pattern like setState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`useLocalStorage: Error setting key "${key}"`, error);
      }
    },
    [key, storedValue]
  );

  // Sync state if localStorage is updated from outside (e.g. another tab)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // ignore parse errors from external writes
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  return [storedValue, setValue];
};
