import { Chorus, Compressor, Filter, Reverb, Tremolo } from "tone";

export interface EffectsChain {
  input: Tremolo; // This is the input node where audio sources connect
  effects: {
    reverb: Reverb;
    compressor: Compressor;
    filter: Filter;
    chorus: Chorus;
    tremolo: Tremolo;
  };
}

export interface EffectsConfig {
  // Reverb settings
  reverbDecay?: number;
  
  // Compressor settings
  compressorThreshold?: number;
  compressorRatio?: number;
  
  // Filter settings
  filterFrequency?: number;
  
  // Chorus settings
  chorusFrequency?: number;
  chorusDelayTime?: number;
  chorusDepth?: number;
  
  // Tremolo settings
  tremoloFrequency?: number;
  tremoloDepth?: number;
}

export const createEffectsChain = (config: EffectsConfig = {}): EffectsChain => {
  const {
    reverbDecay = 4,
    compressorThreshold = -24,
    compressorRatio = 3,
    filterFrequency = 8000,
    chorusFrequency = 0.5,
    chorusDelayTime = 2.5,
    chorusDepth = 0.3,
    tremoloFrequency = 0.1,
    tremoloDepth = 0.3,
  } = config;

  // Create effects chain: input -> tremolo -> chorus -> filter -> compressor -> reverb -> output
  const reverb = new Reverb(reverbDecay).toDestination();
  const compressor = new Compressor(compressorThreshold, compressorRatio).connect(reverb);
  const filter = new Filter(filterFrequency, "lowpass").connect(compressor);
  const chorus = new Chorus(chorusFrequency, chorusDelayTime, chorusDepth).connect(filter);
  const tremolo = new Tremolo(tremoloFrequency, tremoloDepth).connect(chorus);

  return {
    input: tremolo, // This is what audio sources connect to
    effects: {
      reverb,
      compressor,
      filter,
      chorus,
      tremolo,
    },
  };
};

export const disposeEffectsChain = (effectsChain: EffectsChain): void => {
  Object.values(effectsChain.effects).forEach(effect => {
    try {
      effect.dispose();
    } catch (error) {
      console.error("Error disposing effect:", error);
    }
  });
};

// Preset configurations
export const AMBIENT_PRESET: EffectsConfig = {
  reverbDecay: 6,
  compressorThreshold: -30,
  compressorRatio: 4,
  filterFrequency: 6000,
  chorusDepth: 0.4,
  tremoloFrequency: 0.05,
  tremoloDepth: 0.2,
};

export const HYPNAGOGIC_PRESET: EffectsConfig = {
  reverbDecay: 8,
  compressorThreshold: -20,
  compressorRatio: 2,
  filterFrequency: 10000,
  chorusFrequency: 0.3,
  chorusDepth: 0.5,
  tremoloFrequency: 0.08,
  tremoloDepth: 0.4,
};

export const CLEAN_PRESET: EffectsConfig = {
  reverbDecay: 0.1,           
  filterFrequency: 20000,
  chorusFrequency: 0,
  chorusDelayTime: 0,
  chorusDepth: 0,
  tremoloFrequency: 0,
  tremoloDepth: 0,
};