import { describe, it, expect, vi } from "vitest";

// Mock Tone.js effects for effects chain tests
vi.mock("tone", () => ({
  Reverb: vi.fn().mockImplementation(() => ({
    toDestination: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
  })),
  Compressor: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
  })),
  Filter: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
  })),
  Chorus: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
  })),
  Tremolo: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
  })),
  Gain: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
    gain: { rampTo: vi.fn() },
  })),
  Oscillator: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockReturnThis(),
    start: vi.fn(),
    stop: vi.fn(),
    dispose: vi.fn(),
    frequency: { rampTo: vi.fn() },
    state: "stopped",
  })),
}));

import { clampVolume, setGainVolume, updateNoteFrequency } from "../../utils/utils";
import { createEffectsChain, disposeEffectsChain, CLEAN_PRESET } from "../../utils/effects";
import { Gain, Oscillator } from "tone";

describe("utils", () => {
  it("clamps volume between 0 and 1", () => {
    expect(clampVolume(1.5)).toBe(1);
    expect(clampVolume(-0.5)).toBe(0);
    expect(clampVolume(0.5)).toBe(0.5);
  });

  it("sets gain volume using setGainVolume", () => {
    const gain = { gain: { rampTo: vi.fn() } } as unknown as Gain;
    setGainVolume(gain, 0.7);
    expect(gain.gain.rampTo).toHaveBeenCalledWith(0.7, 0.1);
  });

  it("creates and disposes an effects chain without error", () => {
    const chain = createEffectsChain(CLEAN_PRESET);
    expect(chain).toHaveProperty("input");
    expect(chain).toHaveProperty("effects");
    expect(() => disposeEffectsChain(chain)).not.toThrow();
  });

  it("updates oscillator frequency using updateNoteFrequency", () => {
    const osc = { frequency: { rampTo: vi.fn() } } as unknown as Oscillator;
    updateNoteFrequency(osc, "hour", { hours: 1, minutes: 0, seconds: 0 });
    expect(osc.frequency.rampTo).toHaveBeenCalled();
  });
}); 