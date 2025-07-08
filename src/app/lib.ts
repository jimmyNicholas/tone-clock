// Base chromatic scale (semitone indices)
const CHROMATIC_NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// Scale patterns using modular arithmetic
export const SCALE_PATTERNS = {
  chromatic: {
    name: "Chromatic",
    interval: 1, // +1 semitone each step
  },
  circleOfFifths: {
    name: "Circle of Fifths",
    interval: 7, // +7 semitones each step (perfect fifth)
  },
  circleOfFourths: {
    name: "Circle of Fourths",
    interval: 5, // +5 semitones each step (perfect fourth)
  },
};

export const DEFAULT_SCALE = SCALE_PATTERNS.circleOfFifths;

// Generate scale using modular arithmetic
export const generateScale = (
  pattern: (typeof SCALE_PATTERNS)[keyof typeof SCALE_PATTERNS],
  startNote: number = 0
): string[] => {
  const scale: string[] = [];
  let currentSemitone = startNote;

  for (let i = 0; i < 12; i++) {
    scale.push(CHROMATIC_NOTES[currentSemitone % 12]);
    currentSemitone = (currentSemitone + pattern.interval) % 12;
  }

  return scale;
};

// Generate random permutation of all 12 chromatic notes
export const generateRandomScale = (): string[] => {
  const notes = [...CHROMATIC_NOTES];

  // Simple shuffle (Fisher-Yates)
  for (let i = notes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [notes[i], notes[j]] = [notes[j], notes[i]];
  }

  return notes;
};

// Generate notes with octave numbers
export const generateScaleWithOctaves = (
  pattern: (typeof SCALE_PATTERNS)[keyof typeof SCALE_PATTERNS],
  octave: number,
  startNote: number = 0
): string[] => {
  const baseScale = generateScale(pattern, startNote);
  return baseScale.map((note) => `${note}${octave}`);
};

// Convenience exports (maintaining backward compatibility)
export const notes = generateScale(DEFAULT_SCALE);
export const hourNotes = generateScaleWithOctaves(DEFAULT_SCALE, 2);
export const minuteNotes = generateScaleWithOctaves(DEFAULT_SCALE, 3);

// Generate note labels for any scale pattern
export const generateNoteLabels = (
  pattern: (typeof SCALE_PATTERNS)[keyof typeof SCALE_PATTERNS],
  startNote: number = 0
): string[] => {
  return generateScale(pattern, startNote);
};

// Default note labels (for backward compatibility)
export const noteLabels = generateNoteLabels(DEFAULT_SCALE);

// Generate any scale for any octave
export const getNotes = (octave: number, pattern = DEFAULT_SCALE) => {
  return generateScaleWithOctaves(pattern, octave);
};
