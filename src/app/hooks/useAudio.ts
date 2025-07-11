import { useEffect, useState, useCallback, RefObject, useMemo } from "react";
import { Gain, Oscillator } from "tone";
import { getOsc, startAudioEngine } from "../audio";
import {
  getClockFrequency,
  getSecondsInterpolatedFrequency,
  setGainVolume,
  clampVolume,
} from "../utils";
import useNote from "./useNote";

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

interface Note {
  id: string;
  name: string;
  oscillatorRef: RefObject<Oscillator | null>;
  gainRef: RefObject<Gain | null>;
  timeType: "hour" | "minute";
}

export const useAudio = (
  time: Date | null,
  mounted: boolean
): UseAudioReturn => {
  const hourNote = useNote("hour", "Hour Hand", "hour");
  const minuteNote = useNote("minute", "Minute Hand", "minute");

  const noteRefs: Note[] = useMemo(
    () => [hourNote, minuteNote],
    [hourNote, minuteNote]
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
      noteRef: Note,
      currentTime: { hours: number; minutes: number; seconds: number }
    ) => {
      if (!noteRef.oscillatorRef.current) return;

      const frequency = getFrequencyForNoteType(noteRef.timeType, currentTime);
      noteRef.oscillatorRef.current.frequency.rampTo(frequency, 0.1);
    },
    []
  );

  useEffect(() => {
    if (!mounted) return;

    try {
      noteRefs.forEach((note) => {
        note.gainRef.current = new Gain(0.2).toDestination();
        note.oscillatorRef.current = getOsc(note.gainRef.current);
      });
    } catch (error) {
      console.error("Error initializing Tone.js:", error);
    }

    return () => {
      try {
        noteRefs.forEach((noteRef) => {
          if (noteRef.oscillatorRef.current)
            noteRef.oscillatorRef.current.dispose();
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
    setGainVolume(noteRefs[0].gainRef.current, hourVolume);
  }, [hourVolume, noteRefs]);

  useEffect(() => {
    setGainVolume(noteRefs[1].gainRef.current, minuteVolume);
  }, [minuteVolume, noteRefs]);

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
          noteRefs.forEach((note) => {
            if (
              note.oscillatorRef.current &&
              note.oscillatorRef.current.state === "stopped"
            ) {
              note.oscillatorRef.current.start();
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
      noteRefs.forEach((note) => {
        if (
          note.oscillatorRef.current &&
          note.oscillatorRef.current.state === "started"
        ) {
          note.oscillatorRef.current.stop();
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
