import { useEffect, useState } from 'react';

interface UseTimeReturn {
  time: Date | null;
  mounted: boolean;
  selectedTimezone: number;
  setSelectedTimezone: (timezone: number) => void;
}

/**
 * Custom hook to manage current time state with timezone support
 * Returns timezone-adjusted time as the primary 'time' value
 */
export const useTime = (): UseTimeReturn => {
  const [rawTime, setRawTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState<number>(0);

  // Set default timezone on mount
  useEffect(() => {
    try {
      // Get user's current timezone offset in hours
      const userOffset = -(new Date().getTimezoneOffset() / 60);
      setSelectedTimezone(userOffset);
    } catch (error) {
      // Fallback to GMT +0 if there's an error
      console.warn("Could not detect user timezone, defaulting to GMT +0", error);
      setSelectedTimezone(0);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    setRawTime(new Date());
  }, []);

  // Set up timer for continuous updates
  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setRawTime(new Date());
    }, 100);

    return () => clearInterval(timer);
  }, [mounted]);

  // Calculate timezone-adjusted time
  const getTimezoneAdjustedTime = (baseTime: Date | null, timezoneOffset: number): Date | null => {
    if (!baseTime) return null;
    
    try {
      const offsetMs = timezoneOffset * 60 * 60 * 1000;
      const utcTime = baseTime.getTime() + (baseTime.getTimezoneOffset() * 60 * 1000);
      return new Date(utcTime + offsetMs);
    } catch (error) {
      console.warn("Error calculating timezone-adjusted time:", error);
      return baseTime;
    }
  };

  // Return timezone-adjusted time as the primary 'time'
  const time = getTimezoneAdjustedTime(rawTime, selectedTimezone);

  return {
    time,
    mounted,
    selectedTimezone,
    setSelectedTimezone,
  };
}; 