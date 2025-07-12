import { DEFAULT_SCALE, generateScale } from "./lib";
import { Gain, Oscillator } from "tone";

// ===== MUSIC THEORY UTILITIES =====

// Standard note to frequency conversion (A4 = 440Hz)
export const noteToFrequency = (note: string, octave: number = 4): number => {
  const A4 = 440;
  const noteOffsets: { [key: string]: number } = {
    C: -9,
    "C#": -8,
    Db: -8,
    D: -7,
    "D#": -6,
    Eb: -6,
    E: -5,
    F: -4,
    "F#": -3,
    Gb: -3,
    G: -2,
    "G#": -1,
    Ab: -1,
    A: 0,
    "A#": 1,
    Bb: 1,
    B: 2,
  };

  const offset = noteOffsets[note] || 0;
  const octaveOffset = (octave - 4) * 12;
  const totalSemitones = offset + octaveOffset;

  return A4 * Math.pow(2, totalSemitones / 12);
};

// Reverse lookup: frequency to note name (kept for compatibility)
export const getNoteFromFreq = (freq: number): string => {
  const noteFreqs = {
    C: 261.63,
    "C#": 277.18,
    Db: 277.18,
    D: 293.66,
    "D#": 311.13,
    Eb: 311.13,
    E: 329.63,
    F: 349.23,
    "F#": 369.99,
    Gb: 369.99,
    G: 392.0,
    "G#": 415.3,
    Ab: 415.3,
    A: 440.0,
    "A#": 466.16,
    Bb: 466.16,
    B: 493.88,
  };

  let closest = "C";
  let minDiff = Infinity;

  Object.entries(noteFreqs).forEach(([note, noteFreq]) => {
    const diff = Math.abs(freq - noteFreq);
    if (diff < minDiff) {
      minDiff = diff;
      closest = note;
    }
  });

  return closest;
};

// ===== TIME TO NOTE MAPPING =====

interface TimePosition {
  hours: number;
  minutes: number;
  seconds: number;
}

interface NotePosition {
  currentNote: string;
  nextNote: string;
  progress: number; // 0-1, how far between current and next
}

// Direct time to note position mapping (no angles!)
export const getClockNotePosition = (
  time: TimePosition,
  scale = DEFAULT_SCALE,
  isHour = false
): NotePosition => {
  const { hours, minutes, seconds } = time;
  const scaleNotes = generateScale(scale);
  const totalPositions = scaleNotes.length; // Always 12 for our scales

  let position: number;

  if (isHour) {
    // Hour hand: 0-12 hours maps to 0-12 scale positions
    position = (hours % 12) + minutes / 60 + seconds / 3600;
  } else {
    // Minute hand: 0-60 minutes maps to 0-12 scale positions
    position = ((minutes + seconds / 60) / 60) * totalPositions;
  }

  const noteIndex = Math.floor(position) % totalPositions;
  const nextIndex = (noteIndex + 1) % totalPositions;
  const progress = position - Math.floor(position);

  return {
    currentNote: scaleNotes[noteIndex],
    nextNote: scaleNotes[nextIndex],
    progress,
  };
};

// ===== FREQUENCY INTERPOLATION =====

// Clean interpolation between two frequencies
export const getSecondsInterpolatedFrequency = (
  baseFreq: number,
  nextFreq: number,
  seconds: number
): number => {
  const fraction = seconds / 60;
  return baseFreq + (nextFreq - baseFreq) * fraction;
};

// Interpolate between two notes with progress (0-1)
export const interpolateNoteFrequency = (
  currentNote: string,
  nextNote: string,
  progress: number,
  octave: number = 3
): number => {
  const currentFreq = noteToFrequency(currentNote, octave);
  const nextFreq = noteToFrequency(nextNote, octave);

  // Linear interpolation (could be exponential for more musical feel)
  return currentFreq + (nextFreq - currentFreq) * progress;
};

// Main function: Get frequency for current time
export const getClockFrequency = (
  time: TimePosition,
  octave: number = 3,
  scale = DEFAULT_SCALE,
  isHour = false
): number => {
  const notePosition = getClockNotePosition(time, scale, isHour);
  return interpolateNoteFrequency(
    notePosition.currentNote,
    notePosition.nextNote,
    notePosition.progress,
    octave
  );
};

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

  const currentFreq = getClockFrequency(currentMinuteTime, 3, undefined, false);
  const nextFreq = getClockFrequency(nextMinuteTime, 3, undefined, false);

  return getSecondsInterpolatedFrequency(
    currentFreq,
    nextFreq,
    currentTime.seconds
  );
};

export const updateNoteFrequency = (
  //noteRef: Note,
  oscillator: Oscillator | null,
  timeType: "hour" | "minute",
  currentTime: { hours: number; minutes: number; seconds: number }
) => {
  if (!oscillator) return;

  const frequency = getFrequencyForNoteType(timeType, currentTime);
  oscillator.frequency.rampTo(frequency, 0.1);
};

// ===== VOLUME CONTROL =====
export const clampVolume = (
  volume: number,
  min: number = 0,
  max: number = 1
): number => {
  return Math.max(min, Math.min(max, volume));
};

export const setGainVolume = (gainNode: Gain | null, volume: number): void => {
  if (gainNode) {
    gainNode.gain.rampTo(clampVolume(volume), 0.1);
  }
};
