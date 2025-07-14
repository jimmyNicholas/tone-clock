import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAudio } from "../hooks/useAudio";
import { startAudioEngine } from "../audio";
import { OptionsItem } from "../hooks/useOptions";

// Mock the effects module
vi.mock("../utils/effects", () => ({
  createEffectsChain: vi.fn(() => ({
    input: {
      connect: vi.fn().mockReturnThis(),
      dispose: vi.fn(),
    },
    effects: {
      reverb: { dispose: vi.fn() },
      compressor: { dispose: vi.fn() },
      filter: { dispose: vi.fn() },
      chorus: { dispose: vi.fn() },
      tremolo: { dispose: vi.fn() },
    },
  })),
  disposeEffectsChain: vi.fn(),
  CLEAN_PRESET: {
    reverbDecay: 0.1,
    compressorThreshold: -60,
    compressorRatio: 1.1,
    filterFrequency: 20000,
    chorusDepth: 0,
    tremoloDepth: 0,
  },
}));

vi.mock("../audio", () => ({
  startAudioEngine: vi.fn(),
  getOsc: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    dispose: vi.fn(),
    state: "stopped",
    frequency: { rampTo: vi.fn() }
  })),
}));

vi.mock("../utils", () => ({
  updateNoteFrequency: vi.fn(),
  clampVolume: vi.fn((volume) => Math.max(0, Math.min(1, volume))),
  setGainVolume: vi.fn(),
}));

vi.mock("tone", () => ({
  Gain: vi.fn(() => ({
    connect: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
    gain: { rampTo: vi.fn() }
  })),
  Oscillator: vi.fn(),
}));

describe("useAudio", () => {
  const testTime = new Date("2024-01-01T15:30:45");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts with audio stopped", () => {
    const { result } = renderHook(() => useAudio(testTime, true));
    
    expect(result.current.audioStarted).toBe(false);
  });

  it("provides option controls for each note", () => {
    const { result } = renderHook(() => useAudio(testTime, true));
    
    expect(result.current.options).toHaveLength(4);
    expect(result.current.options.map((o: OptionsItem) => o.noteId)).toEqual([ // Using noteId
      "hour", 
      "minute", 
      "harmonyOne", 
      "harmonyTwo"
    ]);
  });

  it("initializes with correct harmonic intervals", () => {
    const { result } = renderHook(() => useAudio(testTime, true));
    
    const harmonyOne = result.current.options.find((o: OptionsItem) => o.noteId === "harmonyOne"); // Using noteId
    const harmonyTwo = result.current.options.find((o: OptionsItem) => o.noteId === "harmonyTwo"); // Using noteId
    
    expect(harmonyOne?.harmonicInterval).toBe(4);
    expect(harmonyTwo?.harmonicInterval).toBe(7);
  });

  describe("when starting audio", () => {
    it("sets audioStarted to true when engine starts successfully", async () => {
      vi.mocked(startAudioEngine).mockResolvedValue(true);
      const { result } = renderHook(() => useAudio(testTime, true));

      await act(async () => {
        await result.current.toggleAudio();
      });

      expect(result.current.audioStarted).toBe(true);
    });

    it("keeps audioStarted false when engine fails to start", async () => {
      vi.mocked(startAudioEngine).mockResolvedValue(false);
      const { result } = renderHook(() => useAudio(testTime, true));

      await act(async () => {
        await result.current.toggleAudio();
      });

      expect(result.current.audioStarted).toBe(false);
    });
  });

  describe("when stopping audio", () => {
    it("sets audioStarted to false", async () => {
      vi.mocked(startAudioEngine).mockResolvedValue(true);
      const { result } = renderHook(() => useAudio(testTime, true));

      await act(async () => {
        await result.current.toggleAudio();
      });

      await act(async () => {
        await result.current.toggleAudio();
      });

      expect(result.current.audioStarted).toBe(false);
    });
  });

  describe("volume control", () => {
    it("updates volume for specified note", () => {
      const { result } = renderHook(() => useAudio(testTime, true));

      act(() => {
        result.current.updateVolume("hour", 0.8); // Using noteId
      });

      const hourOption = result.current.options.find((o: OptionsItem) => o.noteId === "hour"); // Finding by noteId
      expect(hourOption?.volume).toBe(0.8);
    });

    it("clamps volume to valid range", () => {
      const { result } = renderHook(() => useAudio(testTime, true));

      act(() => {
        result.current.updateVolume("hour", 1.5); // Using noteId
        result.current.updateVolume("minute", -0.2); // Using noteId
      });

      const hourOption = result.current.options.find((o: OptionsItem) => o.noteId === "hour"); // Finding by noteId
      const minuteOption = result.current.options.find((o: OptionsItem) => o.noteId === "minute"); // Finding by noteId
      
      expect(hourOption?.volume).toBe(1.0);
      expect(minuteOption?.volume).toBe(0.0);
    });
  });

  describe("harmonic interval control", () => {
    it("updates harmonic interval for harmony notes", () => {
      const { result } = renderHook(() => useAudio(testTime, true));

      act(() => {
        result.current.updateHarmonicInterval("harmonyOne", 12); // Using noteId
      });

      const harmonyOneOption = result.current.options.find((o: OptionsItem) => o.noteId === "harmonyOne"); // Finding by noteId
      expect(harmonyOneOption?.harmonicInterval).toBe(12);
    });
  });

  describe("note type control", () => {
    it("updates note type when changed", () => {
      const { result } = renderHook(() => useAudio(testTime, true));

      act(() => {
        result.current.updateNoteType("harmonyOne", "hour"); // Using noteId
      });

      const harmonyOneOption = result.current.options.find((o: OptionsItem) => o.noteId === "harmonyOne"); // Finding by noteId
      expect(harmonyOneOption?.noteType).toBe("hour");
    });
  });

  describe("edge cases", () => {
    it("handles null time without crashing", () => {
      expect(() => {
        renderHook(() => useAudio(null, true));
      }).not.toThrow();
    });

    it("handles unmounted state without crashing", () => {
      expect(() => {
        renderHook(() => useAudio(testTime, false));
      }).not.toThrow();
    });

    it("cleans up resources on unmount", () => {
      const { unmount } = renderHook(() => useAudio(testTime, true));
      
      expect(() => unmount()).not.toThrow();
    });
  });
});