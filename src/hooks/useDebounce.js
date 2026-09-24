import { useState, useEffect } from 'react';

/**
 * ARCHITECTURAL DECISION: Debounce Custom Hook
 * 
 * WHY THIS HOOK EXISTS:
 * When a user types into a live search field (e.g. typing "laptop"), firing an API request
 * on every single keystroke generates 6+ rapid HTTP requests, wasting bandwidth and triggering
 * server rate limits.
 * 
 * By delaying the state update until the user pauses typing for the specified delay (e.g., 400ms),
 * we only trigger the network request when the user has completed a meaningful query fragment.
 * 
 * @param {any} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (default 400ms)
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel timer if value changes before delay window finishes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
