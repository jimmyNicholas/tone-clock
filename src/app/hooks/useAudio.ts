import { useEffect, useState, RefObject, useRef } from "react";
import { Gain, Oscillator } from "tone";
import { getOsc, startAudioEngine } from "../audio";
import {
  updateNoteFrequency,
} from "../utils";
import useNote from "./useNote";
import { useVolume, VolumesItem } from "./useVolume";

interface UseAudioReturn {
  audioStarted: boolean;
  toggleAudio: () => void;

  volumes: VolumesItem[];
  updateVolume: (noteName: string, newVolume: number) => void;
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

  const notesRef: RefObject<Note[]> = useRef([hourNote, minuteNote]);

  const [audioStarted, setAudioStarted] = useState(false);

  const initialValue = 0.2;
  const { updateVolume, volumes } = useVolume([
    { initialValue: initialValue, noteName: "hour", gainRef: hourNote.gainRef },
    { initialValue: initialValue, noteName: "minute", gainRef: minuteNote.gainRef },
  ]);

  useEffect(() => {
    if (!mounted) return;

    try {
      notesRef.current.forEach((note) => {
        note.gainRef.current = new Gain(0.2).toDestination();
        note.oscillatorRef.current = getOsc(note.gainRef.current);
      });
    } catch (error) {
      console.error("Error initializing Tone.js:", error);
    }

    const currentNotes = notesRef.current;

    return () => {
      try {
        currentNotes.forEach((noteRef) => {
          if (noteRef.oscillatorRef.current)
            noteRef.oscillatorRef.current.dispose();
          if (noteRef.gainRef.current) noteRef.gainRef.current.dispose();
        });
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
        updateNoteFrequency(
          noteRef.oscillatorRef.current,
          noteRef.timeType,
          currentTime
        );
      });
    } catch (error) {
      console.error("Error updating frequencies:", error);
    }
  }, [time, audioStarted, notesRef]);

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

     volumes,
    updateVolume,
   
  };
};
