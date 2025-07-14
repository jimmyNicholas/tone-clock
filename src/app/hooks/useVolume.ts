import { useState } from "react";
import { clampVolume, setGainVolume } from "../utils";
import { Gain } from "tone";

export interface Volume {
  updateVolume: (noteName: string, newVolume: number) => void;
  volumes: VolumesItem[];
}

interface useVolumeProp {
  initialValue: number;
  noteName: string;
  gainRef: React.RefObject<Gain | null>;
}

export interface VolumesItem {
  noteName: string;
  volume: number;
  gainRef: React.RefObject<Gain | null>;
}

export const useVolume = (useVolumeProps: useVolumeProp[]): Volume => {
  const initialVolumes = useVolumeProps.map(
    ({ noteName, initialValue, gainRef }) => ({
      noteName,
      volume: clampVolume(initialValue),
      gainRef,
    })
  );

  const [volumes, setVolumes] = useState(initialVolumes);

  const updateVolume = (noteName: string, newVolume: number) => {
    const note = volumes.find((v) => v.noteName === noteName);
    if (!note || !note.gainRef.current) return;

    const clampedVolume = clampVolume(newVolume);
    setGainVolume(note.gainRef.current, clampedVolume);
    setVolumes((prevVolumes) =>
      prevVolumes.map((note) => {
        if (note.noteName === noteName) {
          return { ...note, volume: clampedVolume };
        }
        return note;
      })
    );
  };

  return {
    volumes,
    updateVolume,
  };
};
