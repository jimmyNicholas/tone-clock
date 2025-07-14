import { RefObject, useRef } from "react";
import { Gain, Oscillator } from "tone";

export interface Note {
  id: string;
  name: string;
  oscillatorRef: RefObject<Oscillator | null>;
  gainRef: RefObject<Gain | null>;
  timeType: "hour" | "minute";
  harmonicInterval?: number;
}

export const useNote = (
  id: string,
  name: string,
  timeType: "hour" | "minute",
  harmonicInterval?: number
): Note => {
  const oscillatorRef = useRef<Oscillator | null>(null);
  const gainRef = useRef<Gain | null>(null);

  return {
    id,
    name,
    oscillatorRef,
    gainRef,
    timeType,
    harmonicInterval,
  };
};

export default useNote;
