import { useEffect, useState } from 'react';

/**
 * Custom hook to manage current time state with automatic updates
 * Updates every 100ms for smooth second transitions
 */
export const useTime = () => {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    setTime(new Date());
  }, []);

  // Set up timer for continuous updates
  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setTime(new Date());
    }, 100);

    return () => clearInterval(timer);
  }, [mounted]);

  return {
    time,
    mounted,
  };
};