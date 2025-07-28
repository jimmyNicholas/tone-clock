import * as Tone from "tone";

export const startAudioEngine = async () => {
  try {
    // Ensure we're in browser environment
    if (typeof window === 'undefined') {
      console.warn('Audio not available in server environment');
      return false;
    }

    const context = Tone.getContext();
    
    // Check if audio context exists and start it
    if (context.state === 'suspended') {
      console.log('Starting audio context...');
      await Tone.start();
      console.log('Audio context started successfully');
    } else if (context.state === 'running') {
      console.log('Audio context already running');
    } else {
      console.log('Audio context state:', context.state);
    }
    
    return context.state === 'running';
  } catch (error) {
    console.error("Error starting audio:", error);
    return false;
  }
};

export const getOsc = (gain: Tone.Gain) => {
  if (typeof window === 'undefined') {
    throw new Error('Audio not available in server environment');
  }
  return new Tone.Oscillator("C2", "sine").connect(gain);
};

export const getChordOscillators = (gain: Tone.Gain, numVoices: number = 3) => {
  if (typeof window === 'undefined') {
    throw new Error('Audio not available in server environment');
  }
  
  const oscillators = [];
  for (let i = 0; i < numVoices; i++) {
    const osc = getOsc(gain);
    oscillators.push(osc);
  }
  return oscillators;
};
