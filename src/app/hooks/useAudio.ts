import { useEffect, useState, RefObject, useRef } from "react";
import { Gain } from "tone";
import { getOsc, startAudioEngine } from "../audio";
import { updateNoteFrequency } from "../utils";
import useNote, { Note } from "./useNote";
import { useOptions, OptionsItem } from "./useOptions";
import {
  createEffectsChain,
  disposeEffectsChain,
  EffectsChain,
  CLEAN_PRESET
} from "../utils/effects";


interface UseAudioReturn {
  audioStarted: boolean;
  toggleAudio: () => void;
  options: OptionsItem[];
  updateVolume: (noteName: string, newVolume: number) => void;
  updateHarmonicInterval: (noteName: string, interval: number) => void;
  updateNoteType: (noteName: string, noteType: "hour" | "minute") => void;
}

export const useAudio = (
  time: Date | null,
  mounted: boolean
): UseAudioReturn => {
  const hourNote = useNote("hour", "hour", "hour");
  const minuteNote = useNote("minute", "minute", "minute");
  const harmonyOne = useNote("harmonyOne", "harmonyOne", "minute");
  const harmonyTwo = useNote("harmonyTwo", "harmonyTwo", "minute");

  const notesRef: RefObject<Note[]> = useRef([
    hourNote,
    minuteNote,
    harmonyOne,
    harmonyTwo,
  ]);
  const masterEffectsRef = useRef<EffectsChain | null>(null);
  const [audioStarted, setAudioStarted] = useState(false);

  const initialVolume = 0.5;

  const {
    updateVolume,
    updateHarmonicInterval,
    options,
    getHarmonicInterval,
    updateNoteType,
  } = useOptions([
    {
      noteId: "hour",
      initialVolume: initialVolume,
      noteName: "Tone One",
      noteType: "hour",
      gainRef: hourNote.gainRef,
      initialHarmonicInterval: 0,
    },
    {
      noteId: "minute",
      initialVolume: initialVolume,
      noteName: "Tone Two",
      noteType: "minute",
      gainRef: minuteNote.gainRef,
      initialHarmonicInterval: 0,
    },
    {
      noteId: "harmonyOne",
      initialVolume: initialVolume,
      noteName: "Tone Three",
      noteType: "minute",
      gainRef: harmonyOne.gainRef,
      initialHarmonicInterval: 4, // Major third
    },
    {
      noteId: "harmonyTwo",
      initialVolume: initialVolume,
      noteName: "Tone Four",
      noteType: "minute",
      gainRef: harmonyTwo.gainRef,
      initialHarmonicInterval: 7, // Perfect fifth
    },
  ]);

  // Initialize audio components
  useEffect(() => {
    if (!mounted) return;

    try {
      const effectsChain = createEffectsChain(CLEAN_PRESET);
      masterEffectsRef.current = effectsChain;

      notesRef.current.forEach((note) => {
        note.gainRef.current = new Gain(initialVolume).connect(effectsChain.input);
        note.oscillatorRef.current = getOsc(note.gainRef.current);
      });
    } catch (error) {
      console.error("Error initializing Tone.js:", error);
    }

    const currentNotes = notesRef.current;
    const currentEffects = masterEffectsRef.current;

    return () => {
      try {
        currentNotes.forEach((noteRef) => {
          if (noteRef.oscillatorRef.current)
            noteRef.oscillatorRef.current.dispose();
          if (noteRef.gainRef.current) noteRef.gainRef.current.dispose();
        });

        // Cleanup master effects
        if (currentEffects) {
          disposeEffectsChain(currentEffects);
        }
      } catch (error) {
        console.error("Error disposing Tone.js objects:", error);
      }
    };
  }, [mounted]);

  // Main audio frequency update
  useEffect(() => {
    if (!audioStarted || !time) return;

    try {
      const currentTime = {
        hours: time.getHours() % 12,
        minutes: time.getMinutes(),
        seconds: time.getSeconds(),
      };

      notesRef.current.forEach((noteRef) => {
        // Get the harmonic interval if this is a harmony note
        const option = options.find((o) => o.noteId === noteRef.id);
        const timeType = option?.noteType;
        const harmonicInterval = getHarmonicInterval(noteRef.id);

        if (!timeType) return;
        updateNoteFrequency(
          noteRef.oscillatorRef.current,
          timeType,
          currentTime,
          harmonicInterval
        );
      });
    } catch (error) {
      console.error("Error updating frequencies:", error);
    }
  }, [time, audioStarted, options, getHarmonicInterval]);

  // Audio control functions
  const startAudio = async () => {
    try {
      await startAudioEngine()
        .then((ret) => setAudioStarted(ret))
        .then(() => {
          // Start all oscillators
          notesRef.current.forEach((note) => {
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
      notesRef.current.forEach((note) => {
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
    audioStarted,
    toggleAudio,
    options,
    updateVolume,
    updateHarmonicInterval,
    updateNoteType,
  };
};
