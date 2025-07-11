import { RefObject, useRef } from "react";
import { Gain, Oscillator } from "tone";

interface UseNoteReturn {
  id: string;
  name: string;
  oscillatorRef: RefObject<Oscillator | null>;
  gainRef: RefObject<Gain | null>;
  timeType: "hour" | "minute";
}

const useNote = (
  id: string,
  name: string,
  timeType: "hour" | "minute"
): UseNoteReturn => {
  const oscillatorRef = useRef<Oscillator | null>(null);
  const gainRef = useRef<Gain | null>(null);

  return {
    id,
    name,
    oscillatorRef,
    gainRef,
    timeType,
  };
};

export default useNote;
