import * as Tone from "tone";

export const startAudioEngine = async () => {
  try {
    if (Tone.getContext()) {
      await Tone.start();
    }
    return true;
  } catch (error) {
    console.error("Error starting audio:", error);
    return false;
  }
};

export const getOsc = (gain: Tone.Gain) => {
  return new Tone.Oscillator("C2", "sine").connect(gain);
};

export const getChordOscillators = (gain: Tone.Gain, numVoices: number = 3) => {
  const oscillators = [];
  for (let i = 0; i < numVoices; i++) {
    const osc = getOsc(gain);
    oscillators.push(osc);
  }
  return oscillators;
};
