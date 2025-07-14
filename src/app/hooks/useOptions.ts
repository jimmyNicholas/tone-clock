import { useState } from "react";
import { clampVolume, setGainVolume } from "../utils";
import { Gain } from "tone";

export interface AudioOptions {
  updateVolume: (noteName: string, newVolume: number) => void;
  updateHarmonicInterval: (noteName: string, interval: number) => void;
  options: OptionsItem[];
  getVolume: (noteName: string) => number;
  getHarmonicInterval: (noteName: string) => number | undefined;
}

interface UseOptionsProps {
  initialVolume: number;
  noteName: string;
  gainRef: React.RefObject<Gain | null>;
  initialHarmonicInterval: number; 
}

export interface OptionsItem {
  noteName: string;
  volume: number;
  harmonicInterval?: number;
  gainRef: React.RefObject<Gain | null>;
}

export const useOptions = (useOptionsProps: UseOptionsProps[]): AudioOptions => {
  const initialOptions = useOptionsProps.map(
    ({ noteName, initialVolume, gainRef, initialHarmonicInterval }) => ({
      noteName,
      volume: clampVolume(initialVolume),
      harmonicInterval: initialHarmonicInterval,
      gainRef,
    })
  );

  const [options, setOptions] = useState(initialOptions);

  const updateVolume = (noteName: string, newVolume: number) => {
    const note = options.find((o) => o.noteName === noteName);
    if (!note || !note.gainRef.current) return;

    const clampedVolume = clampVolume(newVolume);
    setGainVolume(note.gainRef.current, clampedVolume);
    
    setOptions((prevOptions) =>
      prevOptions.map((option) => {
        if (option.noteName === noteName) {
          return { ...option, volume: clampedVolume };
        }
        return option;
      })
    );
  };

  const updateHarmonicInterval = (noteName: string, interval: number) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) => {
        if (option.noteName === noteName) {
          return { ...option, harmonicInterval: interval };
        }
        return option;
      })
    );
  };

  const getVolume = (noteName: string): number => {
    const option = options.find((o) => o.noteName === noteName);
    return option ? option.volume : 0;
  };

  const getHarmonicInterval = (noteName: string): number | undefined => {
    const option = options.find((o) => o.noteName === noteName);
    return option?.harmonicInterval;
  };

  return {
    options,
    updateVolume,
    updateHarmonicInterval,
    getVolume,
    getHarmonicInterval,
  };
};