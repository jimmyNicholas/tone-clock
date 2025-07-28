import { useEffect, useState, useRef, useCallback } from "react";
import {
  Chorus,
  Compressor,
  Filter,
  Gain,
  Oscillator,
  Reverb,
  Tremolo,
} from "tone";
import { getOsc, startAudioEngine } from "@/utils/audio";
import { clampVolume, setGainVolume, updateNoteFrequency } from "@/utils/utils";

// Lazy load effects to prevent AudioContext creation on import
type EffectsChain = {
  input: Tremolo;
  effects: {
    reverb: Reverb;
    compressor: Compressor;
    filter: Filter;
    chorus: Chorus;
    tremolo: Tremolo;
  };
};

type EffectsConfig = {
  reverbDecay?: number;
  compressorThreshold?: number;
  compressorRatio?: number;
  filterFrequency?: number;
  chorusFrequency?: number;
  chorusDelayTime?: number;
  chorusDepth?: number;
  tremoloFrequency?: number;
  tremoloDepth?: number;
};

const CLEAN_PRESET: EffectsConfig = {
  reverbDecay: 0.1,
  filterFrequency: 20000,
  chorusFrequency: 0,
  chorusDelayTime: 0,
  chorusDepth: 0,
  tremoloFrequency: 0,
  tremoloDepth: 0,
};

// Lazy load effects functions
let createEffectsChain: ((config?: EffectsConfig) => EffectsChain) | null =
  null;
let disposeEffectsChain: ((effectsChain: EffectsChain) => void) | null = null;

const loadEffects = async () => {
  if (!createEffectsChain) {
    const effects = await import("@/utils/effects");
    createEffectsChain = effects.createEffectsChain;
    disposeEffectsChain = effects.disposeEffectsChain;
  }
};

export type TimeType = "hour" | "minute";

export interface AudioNote {
  id: string;
  name: string;
  timeType: TimeType;
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

export const useAudio = (time: Date | null): UseAudioReturn => {
  const [audioState, setAudioState] = useState<{
    started: boolean;
    initialized: boolean;
    notes: AudioNote[];
  }>({
    initialized: false,
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
    initialized: false,
  });

  const getNote = useCallback(
    (noteId: string) => {
      const stateNote = audioState.notes.find((n) => n.id === noteId);
      const refNote = audioRefs.current.notes.find((n) => n.id === noteId);
      return { state: stateNote, refs: refNote };
    },
    [audioState.notes]
  );

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

  // Initialize audio objects (only after user interaction)
  const initializeAudio = async () => {
    if (audioRefs.current.initialized) return;

    try {
      // Load effects module
      await loadEffects();

      if (!createEffectsChain) {
        throw new Error("Failed to load effects module");
      }

      // Create effects chain
      audioRefs.current.effects = createEffectsChain(CLEAN_PRESET);

      // Create oscillators and gains for each note
      audioRefs.current.notes.forEach((noteRef) => {
        const gain = new Gain(0.5);
        gain.connect(audioRefs.current.effects!.input);
        noteRef.gainRef.current = gain;

        const oscillator = getOsc(gain);
        noteRef.oscillatorRef.current = oscillator;
      });

      audioRefs.current.initialized = true;
    } catch (error) {
      console.error("Error initializing Tone.js:", error);
    }
  };

  // Cleanup function
  useEffect(() => {
    const currentRefs = audioRefs.current;
    return () => {
      try {
        // Cleanup individual note refs
        currentRefs.notes.forEach((noteRef) => {
          if (noteRef.oscillatorRef.current)
            noteRef.oscillatorRef.current.dispose();
          if (noteRef.gainRef.current) noteRef.gainRef.current.dispose();
        });

        // Cleanup master effects
        if (currentRefs.effects && disposeEffectsChain) {
          disposeEffectsChain(currentRefs.effects);
        }
      } catch (error) {
        console.error("Error disposing Tone.js objects:", error);
      }
    };
  }, []);

  // Main audio frequency update
  useEffect(() => {
    if (!audioState.started || !time || !audioRefs.current.initialized) return;

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
      // Only start audio context if not already initialized
      if (!audioRefs.current.initialized) {
        const success = await startAudioEngine();
        if (!success) {
          console.warn("Failed to start audio context");
          return;
        }
        
        // Initialize audio objects
        await initializeAudio();
      }

      // Update state to indicate audio is started
      setAudioState((prev) => ({ ...prev, initialized: true, started: true }));

      // Start all oscillators
      audioRefs.current.notes.forEach((noteRef) => {
        if (
          noteRef.oscillatorRef.current &&
          noteRef.oscillatorRef.current.state === "stopped"
        ) {
          noteRef.oscillatorRef.current.start();
        }
      });
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
