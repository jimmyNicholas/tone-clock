import { useEffect, useState, useRef, useCallback } from "react";
import { Gain, Oscillator } from "tone";
import { getOsc, startAudioEngine } from "../app/audio";
import { clampVolume, setGainVolume, updateNoteFrequency } from "../utils/utils";
import {
  createEffectsChain,
  disposeEffectsChain,
  EffectsChain,
  CLEAN_PRESET,
} from "../utils/effects";

export interface AudioNote {
  id: string;
  name: string;
  timeType: "hour" | "minute";
  volume: number;
  harmonicInterval: number;
}

interface AudioNoteRefs {
  id: string;
  oscillatorRef: { current: Oscillator | null };
  gainRef: { current: Gain | null };
}

interface UseAudioReturn {
  audioStarted: boolean;
  toggleAudio: () => void;
  notes: AudioNote[];
  updateVolume: (noteName: string, newVolume: number) => void;
  updateHarmonicInterval: (noteName: string, interval: number) => void;
  updateNoteType: (noteName: string, noteType: "hour" | "minute") => void;
}

const audioConfig = {
    notes: [
      {
        id: "toneOne",
        name: "Tone One",
        timeType: "hour",
        volume: 0.5,
        harmonicInterval: 0,
      },
      {
        id: "toneTwo",
        name: "Tone Two",
        timeType: "hour",
        volume: 0.5,
        harmonicInterval: 7,
      },
      {
        id: "toneThree",
        name: "Tone Three",
        timeType: "minute",
        volume: 0.5,
        harmonicInterval: 0,
      },
      {
        id: "toneFour",
        name: "Tone Four",
        timeType: "minute",
        volume: 0.5,
        harmonicInterval: 7,
      },
    ] as AudioNote[],
  };

export const useAudio = (
  time: Date | null,
  mounted: boolean
): UseAudioReturn => {
  const [audioState, setAudioState] = useState<{ started: boolean; notes: AudioNote[] }>({
    started: false,
    notes: audioConfig.notes,
  });

  const audioRefs = useRef({
    effects: null as EffectsChain | null,
    notes: audioConfig.notes.map((note) => ({
      id: note.id,
      oscillatorRef: { current: null as Oscillator | null },
      gainRef: { current: null as Gain | null },
    })) as AudioNoteRefs[],
  });

  const getNote = useCallback((noteId: string) => {
    const stateNote = audioState.notes.find((n) => n.id === noteId);
    const refNote = audioRefs.current.notes.find((n) => n.id === noteId);
    return { state: stateNote, refs: refNote };
  }, [audioState.notes]);

  const updateVolume = (noteId: string, volume: number) => {
    const { refs } = getNote(noteId);
    const clampedVolume = clampVolume(volume);

    // Update Tone.js
    if (refs?.gainRef.current) {
      setGainVolume(refs.gainRef.current, clampedVolume);
    }

    // Update state
    setAudioState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === noteId ? { ...n, volume: clampedVolume } : n
      ),
    }));
  };

  const updateHarmonicInterval = (noteId: string, interval: number) => {
    setAudioState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === noteId ? { ...n, harmonicInterval: interval } : n
      ),
    }));
  };

  const updateNoteType = (noteId: string, noteType: "hour" | "minute") => {
    setAudioState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === noteId ? { ...n, timeType: noteType } : n
      ),
    }));
  };

  // Initialize audio components
  useEffect(() => {
    if (!mounted) return;

    try {
      const effectsChain = createEffectsChain(CLEAN_PRESET);
      audioRefs.current.effects = effectsChain;

      audioRefs.current.notes.forEach((noteRef) => {
        const configNote = audioConfig.notes.find((n) => n.id === noteRef.id);
        if (!configNote) return;

        noteRef.gainRef.current = new Gain(configNote.volume).connect(
          effectsChain.input
        );
        noteRef.oscillatorRef.current = getOsc(noteRef.gainRef.current);
      });
    } catch (error) {
      console.error("Error initializing Tone.js:", error);
    }

    const currentRefs = audioRefs.current;

    return () => {
      try {
        currentRefs.notes.forEach((noteRef) => {
          if (noteRef.oscillatorRef.current)
            noteRef.oscillatorRef.current.dispose();
          if (noteRef.gainRef.current) noteRef.gainRef.current.dispose();
        });

        // Cleanup master effects
        if (currentRefs.effects) {
          disposeEffectsChain(currentRefs.effects);
        }
      } catch (error) {
        console.error("Error disposing Tone.js objects:", error);
      }
    };
  }, [mounted]);

  // Main audio frequency update
  useEffect(() => {
    if (!audioState.started || !time) return;

    try {
      const currentTime = {
        hours: time.getHours() % 12,
        minutes: time.getMinutes(),
        seconds: time.getSeconds(),
      };

      audioState.notes.forEach((note) => {
        const { refs } = getNote(note.id);
        if (refs?.oscillatorRef.current) {
          updateNoteFrequency(
            refs.oscillatorRef.current,
            note.timeType,
            currentTime,
            note.harmonicInterval
          );
        }
      });
    } catch (error) {
      console.error("Error updating frequencies:", error);
    }
  }, [time, audioState.started, audioState.notes, getNote]);

  // Audio control functions
  const startAudio = async () => {
    try {
      const success = await startAudioEngine();
      if (success) {
        setAudioState((prev) => ({ ...prev, started: true }));

        // Start all oscillators
        audioRefs.current.notes.forEach((noteRef) => {
          if (
            noteRef.oscillatorRef.current &&
            noteRef.oscillatorRef.current.state === "stopped"
          ) {
            noteRef.oscillatorRef.current.start();
          }
        });
      }
    } catch (error) {
      console.error("Error starting audio:", error);
    }
  };

  const stopAudio = () => {
    try {
      // Stop all oscillators
      audioRefs.current.notes.forEach((noteRef) => {
        if (
          noteRef.oscillatorRef.current &&
          noteRef.oscillatorRef.current.state === "started"
        ) {
          noteRef.oscillatorRef.current.stop();
        }
      });

      // Update audio state
      setAudioState((prev) => ({ ...prev, started: false }));
    } catch (error) {
      console.error("Error stopping audio:", error);
    }
  };

  const toggleAudio = () => {
    if (audioState.started) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  return {
    audioStarted: audioState.started,
    toggleAudio,
    notes: audioState.notes,
    updateVolume,
    updateHarmonicInterval,
    updateNoteType,
  };
}; 