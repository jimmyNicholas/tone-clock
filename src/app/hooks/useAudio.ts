import { useEffect, useRef, useState, useCallback } from "react";
import { Gain, Oscillator } from "tone";
import { getChordOscillators, getOsc, startAudioEngine } from "../audio";
import {
  getClockFrequency,
  getSecondsInterpolatedFrequency,
  getClockTriad,
  setGainVolume,
  clampVolume,
} from "../utils";

interface UseAudioReturn {
  // Audio state
  audioStarted: boolean;
  chordMode: boolean;
  hourVolume: number;
  minuteVolume: number;

  // Audio controls
  toggleAudio: () => void;
  toggleChordMode: () => void;
  setHourVolume: (volume: number) => void;
  setMinuteVolume: (volume: number) => void;
}

export const useAudio = (
  time: Date | null,
  mounted: boolean
): UseAudioReturn => {
  // Audio refs
  const hourOscRef = useRef<Oscillator>(null);
  const minuteOscRef = useRef<Oscillator>(null);
  const chordOscRef = useRef<Oscillator[]>(null);
  const hourGainRef = useRef<Gain>(null);
  const minuteGainRef = useRef<Gain>(null);

  // Audio state
  const [audioStarted, setAudioStarted] = useState(false);
  const [chordMode, setChordMode] = useState(false);
  const [hourVolume, setHourVolumeState] = useState(0.2);
  const [minuteVolume, setMinuteVolumeState] = useState(0.2);

  // Helper function: Update hour and minute frequencies
  const updateSingleNoteFrequencies = useCallback(
    (currentTime: { hours: number; minutes: number; seconds: number }) => {
      if (!hourOscRef.current || !minuteOscRef.current) return;

      // Hour frequency
      const hourFreq = getClockFrequency(currentTime, 2, undefined, true);
      hourOscRef.current.frequency.rampTo(hourFreq, 0.1);

      // Minute frequency with interpolation
      const currentMinuteTime = {
        hours: currentTime.hours,
        minutes: currentTime.minutes,
        seconds: 0,
      };
      const nextMinuteTime = {
        hours: currentTime.hours,
        minutes: (currentTime.minutes + 1) % 60,
        seconds: 0,
      };

      const currentMinuteFreq = getClockFrequency(
        currentMinuteTime,
        3,
        undefined,
        false
      );
      const nextMinuteFreq = getClockFrequency(
        nextMinuteTime,
        3,
        undefined,
        false
      );

      const minuteFreq = getSecondsInterpolatedFrequency(
        currentMinuteFreq,
        nextMinuteFreq,
        currentTime.seconds
      );

      minuteOscRef.current.frequency.rampTo(minuteFreq, 0.1);
    },
    []
  );

  // Helper function: Update chord frequencies
  const updateChordFrequencies = useCallback(
    (currentTime: { hours: number; minutes: number; seconds: number }) => {
      if (!chordOscRef.current) return;

      // Calculate chord positions (every 5 minutes)
      const currentChordPosition = Math.floor(currentTime.minutes / 5);
      const nextChordPosition = (currentChordPosition + 1) % 12;

      const currentChordTime = {
        hours: currentTime.hours,
        minutes: currentChordPosition * 5,
        seconds: 0,
      };
      const nextChordTime = {
        hours: currentTime.hours,
        minutes: nextChordPosition * 5,
        seconds: 0,
      };

      // Get triads
      const { currentTriad } = getClockTriad(currentChordTime, 3);
      const { currentTriad: nextTriad } = getClockTriad(nextChordTime, 3);

      // Calculate progress within 5-minute period
      const minutesIntoChord = currentTime.minutes % 5;
      const secondsIntoChord = minutesIntoChord + currentTime.seconds / 60;
      const chordProgress = secondsIntoChord / 5;

      // Interpolate and update chord oscillators
      const interpolatedTriadFreqs = currentTriad.map(
        (freq, i) => freq + (nextTriad[i] - freq) * chordProgress
      );

      interpolatedTriadFreqs.forEach((freq, i) => {
        if (chordOscRef.current && chordOscRef.current[i]) {
          chordOscRef.current[i].frequency.rampTo(freq, 0.1);
        }
      });
    },
    []
  );

  // Helper function: Manage oscillator states
  const manageOscillatorStates = useCallback(() => {
    if (!minuteOscRef.current || !chordOscRef.current) return;

    if (chordMode) {
      // Start chord oscillators, stop single note
      chordOscRef.current.forEach((osc) => {
        if (osc.state !== "started") osc.start();
      });

      if (minuteOscRef.current.state === "started") {
        minuteOscRef.current.stop();
      }
    } else {
      // Stop chord oscillators, start single note
      chordOscRef.current.forEach((osc) => {
        if (osc.state === "started") osc.stop();
      });

      if (minuteOscRef.current.state !== "started") {
        minuteOscRef.current.start();
      }
    }
  }, [chordMode]);

  // Initialize audio components
  useEffect(() => {
    if (!mounted) return;

    try {
      hourGainRef.current = new Gain(0.2).toDestination();
      minuteGainRef.current = new Gain(0.2).toDestination();

      hourOscRef.current = getOsc(hourGainRef.current);
      minuteOscRef.current = getOsc(minuteGainRef.current);
      chordOscRef.current = getChordOscillators(minuteGainRef.current, 3);
    } catch (error) {
      console.error("Error initializing Tone.js:", error);
    }

    return () => {
      try {
        if (hourOscRef.current) hourOscRef.current.dispose();
        if (minuteOscRef.current) minuteOscRef.current.dispose();
        if (chordOscRef.current)
          chordOscRef.current.forEach((osc) => osc.dispose());
        if (hourGainRef.current) hourGainRef.current.dispose();
        if (minuteGainRef.current) minuteGainRef.current.dispose();
      } catch (error) {
        console.error("Error disposing Tone.js objects:", error);
      }
    };
  }, [mounted]);

  const setHourVolume = useCallback((volume: number) => {
    setHourVolumeState(clampVolume(volume));
  }, []);

  const setMinuteVolume = useCallback((volume: number) => {
    setMinuteVolumeState(clampVolume(volume));
  }, []);

  useEffect(() => {
    setGainVolume(hourGainRef.current, hourVolume);
  }, [hourVolume]);

  useEffect(() => {
    setGainVolume(minuteGainRef.current, minuteVolume);
  }, [minuteVolume]);

  // Main audio frequency update (now much cleaner!)
  useEffect(() => {
    if (!audioStarted || !hourOscRef.current || !minuteOscRef.current || !time)
      return;

    try {
      const currentTime = {
        hours: time.getHours() % 12,
        minutes: time.getMinutes(),
        seconds: time.getSeconds(),
      };

      // Update frequencies
      updateSingleNoteFrequencies(currentTime);

      if (chordMode) {
        updateChordFrequencies(currentTime);
      }

      // Manage oscillator states
      manageOscillatorStates();
    } catch (error) {
      console.error("Error updating frequencies:", error);
    }
  }, [
    time,
    audioStarted,
    chordMode,
    updateSingleNoteFrequencies,
    updateChordFrequencies,
    manageOscillatorStates,
  ]);

  // Audio control functions
  const startAudio = async () => {
    try {
      await startAudioEngine()
        .then((ret) => setAudioStarted(ret))
        .then(() => {
          if (hourOscRef.current && hourOscRef.current.state === "stopped") {
            hourOscRef.current.start();
          }
          if (
            minuteOscRef.current &&
            minuteOscRef.current.state === "stopped"
          ) {
            minuteOscRef.current.start();
          }
        });
    } catch (error) {
      console.error("Error starting audio:", error);
    }
  };

  const stopAudio = () => {
    try {
      // Stop all oscillators
      if (hourOscRef.current && hourOscRef.current.state === "started") {
        hourOscRef.current.stop();
      }
      if (minuteOscRef.current && minuteOscRef.current.state === "started") {
        minuteOscRef.current.stop();
      }
      if (chordOscRef.current) {
        chordOscRef.current.forEach((osc) => {
          if (osc.state === "started") {
            osc.stop();
          }
        });
      }

      // Update audio state
      setAudioStarted(false);
    } catch (error) {
      console.error("Error stopping audio:", error);
    }
  };

  const toggleAudio = () => {
    if (audioStarted) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const toggleChordMode = () => {
    setChordMode(!chordMode);
  };

  return {
    // Audio state
    audioStarted,
    chordMode,
    hourVolume,
    minuteVolume,

    // Audio controls
    toggleAudio,
    toggleChordMode,
    setHourVolume,
    setMinuteVolume,
  };
};
