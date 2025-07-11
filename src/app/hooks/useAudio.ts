import {
  useEffect,
  useRef,
  useState,
  useCallback,
  RefObject,
  useMemo,
} from "react";
import { Gain, Oscillator } from "tone";
import { getOsc, startAudioEngine } from "../audio";
import {
  getClockFrequency,
  getSecondsInterpolatedFrequency,
  setGainVolume,
  clampVolume,
} from "../utils";

interface UseAudioReturn {
  // Audio state
  audioStarted: boolean;
  hourVolume: number;
  minuteVolume: number;

  // Audio controls
  toggleAudio: () => void;
  setHourVolume: (volume: number) => void;
  setMinuteVolume: (volume: number) => void;
}

interface NoteRef {
  oscillatorRef: RefObject<Oscillator | null>;
  gainRef: RefObject<Gain | null>;
  type: "hour" | "minute";
}

export const useAudio = (
  time: Date | null,
  mounted: boolean
): UseAudioReturn => {
  // Audio refs
  const hourOscRef = useRef<Oscillator | null>(null);
  const minuteOscRef = useRef<Oscillator | null>(null);
  const hourGainRef = useRef<Gain | null>(null);
  const minuteGainRef = useRef<Gain | null>(null);
  const oscRefs = [
    hourOscRef,
    minuteOscRef || [],
  ] as RefObject<Oscillator | null>[];

  const noteRefs: NoteRef[] = useMemo(
    () => [
      { oscillatorRef: hourOscRef, gainRef: hourGainRef, type: "hour" },
      { oscillatorRef: minuteOscRef, gainRef: minuteGainRef, type: "minute" },
    ],
    []
  );

  // Audio state
  const [audioStarted, setAudioStarted] = useState(false);
  const [hourVolume, setHourVolumeState] = useState(0.2);
  const [minuteVolume, setMinuteVolumeState] = useState(0.2);

  const getFrequencyForNoteType = (
    type: "hour" | "minute",
    currentTime: { hours: number; minutes: number; seconds: number }
  ): number => {
    if (type === "hour") {
      return getClockFrequency(currentTime, 2, undefined, true);
    }

    const currentMinuteTime = { ...currentTime, seconds: 0 };
    const nextMinuteTime = {
      ...currentTime,
      minutes: (currentTime.minutes + 1) % 60,
      seconds: 0,
    };

    const currentFreq = getClockFrequency(
      currentMinuteTime,
      3,
      undefined,
      false
    );
    const nextFreq = getClockFrequency(nextMinuteTime, 3, undefined, false);

    return getSecondsInterpolatedFrequency(
      currentFreq,
      nextFreq,
      currentTime.seconds
    );
  };

  const updateNoteFrequency = useCallback(
    (
      noteRef: NoteRef,
      currentTime: { hours: number; minutes: number; seconds: number }
    ) => {
      if (!noteRef.oscillatorRef.current) return;

      const frequency = getFrequencyForNoteType(noteRef.type, currentTime);
      noteRef.oscillatorRef.current.frequency.rampTo(frequency, 0.1);
    },
    []
  );

  useEffect(() => {
    if (!mounted) return;

    try {
      hourGainRef.current = new Gain(0.2).toDestination();
      minuteGainRef.current = new Gain(0.2).toDestination();
      hourOscRef.current = getOsc(hourGainRef.current);
      minuteOscRef.current = getOsc(minuteGainRef.current);
    } catch (error) {
      console.error("Error initializing Tone.js:", error);
    }

    return () => {
      try {
        noteRefs.forEach((noteRef) => {
          if (noteRef.oscillatorRef.current) noteRef.oscillatorRef.current.dispose();
          if (noteRef.gainRef.current) noteRef.gainRef.current.dispose();
        });
      } catch (error) {
        console.error("Error disposing Tone.js objects:", error);
      }
    };
  }, [mounted, noteRefs]);

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
    if (!audioStarted || !time) return;

    try {
      const currentTime = {
        hours: time.getHours() % 12,
        minutes: time.getMinutes(),
        seconds: time.getSeconds(),
      };

      noteRefs.forEach((noteRef) => {
        updateNoteFrequency(noteRef, currentTime);
      });
    } catch (error) {
      console.error("Error updating frequencies:", error);
    }
  }, [time, audioStarted, updateNoteFrequency, noteRefs]);

  // Audio control functions
  const startAudio = async () => {
    try {
      await startAudioEngine()
        .then((ret) => setAudioStarted(ret))
        .then(() => {
          // Start all oscillators
          oscRefs.forEach((oscRef) => {
            if (oscRef.current && oscRef.current.state === "stopped") {
              oscRef.current.start();
            }
          });
        });
    } catch (error) {
      console.error("Error starting audio:", error);
    }
  };

  const stopAudio = () => {
    try {
      // Stop all oscillators
      oscRefs.forEach((oscRef) => {
        if (oscRef.current && oscRef.current.state === "started") {
          oscRef.current.stop();
        }
      });
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

  return {
    // Audio state
    audioStarted,
    hourVolume,
    minuteVolume,

    // Audio controls
    toggleAudio,
    setHourVolume,
    setMinuteVolume,
  };
};
