import { useState } from "react";
import { clampVolume, setGainVolume } from "../utils";
import { Gain } from "tone";

export interface AudioOptions {
  updateVolume: (noteId: string, newVolume: number) => void;
  updateHarmonicInterval: (noteId: string, interval: number) => void;
  options: OptionsItem[];
  getVolume: (noteId: string) => number;
  getHarmonicInterval: (noteId: string) => number | undefined;
  updateNoteType: (noteId: string, noteType: "hour" | "minute") => void;
}

interface UseOptionsProps {
  initialVolume: number;
  noteId: string;
  noteName: string;
  noteType: "hour" | "minute";
  gainRef: React.RefObject<Gain | null>;
  initialHarmonicInterval: number;
}

export interface OptionsItem {
  noteId: string;
  noteName: string;
  volume: number;
  noteType: "hour" | "minute";
  harmonicInterval?: number;
  gainRef: React.RefObject<Gain | null>;
}

export const useOptions = (
  useOptionsProps: UseOptionsProps[]
): AudioOptions => {
  const initialOptions = useOptionsProps.map(
    ({
      noteId,
      noteName,
      initialVolume,
      gainRef,
      initialHarmonicInterval,
      noteType,
    }) => ({
      noteId,
      noteName,
      volume: clampVolume(initialVolume),
      harmonicInterval: initialHarmonicInterval,
      gainRef,
      noteType,
    })
  );

  const [options, setOptions] = useState(initialOptions);

  const updateVolume = (noteId: string, newVolume: number) => {
    const note = options.find((o) => o.noteId === noteId);
    if (!note || !note.gainRef.current) return;

    const clampedVolume = clampVolume(newVolume);
    setGainVolume(note.gainRef.current, clampedVolume);

    setOptions((prevOptions) =>
      prevOptions.map((option) => {
        if (option.noteId === noteId) {
          return { ...option, volume: clampedVolume };
        }
        return option;
      })
    );
  };

  const updateHarmonicInterval = (noteId: string, interval: number) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => {
        if (option.noteId === noteId) {
          return { ...option, harmonicInterval: interval };
        }
        return option;
      })
    );
  };

  const updateNoteType = (noteId: string, noteType: "hour" | "minute") => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => {
        if (option.noteId === noteId) {
          return { ...option, noteType };
        }
        return option;
      })
    );
  };

  const getVolume = (noteId: string): number => {
    const option = options.find((o) => o.noteId === noteId);
    return option ? option.volume : 0;
  };

  const getHarmonicInterval = (noteId: string): number | undefined => {
    const option = options.find((o) => o.noteId === noteId);
    return option?.harmonicInterval;
  };

  return {
    options,
    updateVolume,
    updateHarmonicInterval,
    updateNoteType,
    getVolume,
    getHarmonicInterval,
  };
};
