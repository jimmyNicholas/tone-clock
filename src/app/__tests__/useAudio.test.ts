import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAudio } from "../hooks/useAudio";
import { startAudioEngine } from "../audio";
import { OptionsItem } from "../hooks/useOptions";

// Only mock what we absolutely need to
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
    toDestination: vi.fn().mockReturnThis(),
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
    
    expect(result.current.options).toHaveLength(4); // hour, minute, harmonyOne, harmonyTwo
    expect(result.current.options.map((o: OptionsItem) => o.noteName)).toEqual([
      "hour", 
      "minute", 
      "harmonyOne", 
      "harmonyTwo"
    ]);
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

      // Start audio first
      await act(async () => {
        await result.current.toggleAudio();
      });

      // Then stop it
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
        result.current.updateVolume("hour", 0.8);
      });

      const hourOption = result.current.options.find((o: OptionsItem) => o.noteName === "hour");
      expect(hourOption?.volume).toBe(0.8);
    });

    it("clamps volume to valid range", () => {
      const { result } = renderHook(() => useAudio(testTime, true));

      act(() => {
        result.current.updateVolume("hour", 1.5);
        result.current.updateVolume("minute", -0.2);
      });

      const hourOption = result.current.options.find((o: OptionsItem) => o.noteName === "hour");
      const minuteOption = result.current.options.find((o: OptionsItem) => o.noteName === "minute");
      
      expect(hourOption?.volume).toBe(1.0);
      expect(minuteOption?.volume).toBe(0.0);
    });
  });

  describe("harmonic interval control", () => {
    it("updates harmonic interval for harmony notes", () => {
      const { result } = renderHook(() => useAudio(testTime, true));

      act(() => {
        result.current.updateHarmonicInterval("harmonyOne", 7); // Perfect fifth
      });

      const harmonyOneOption = result.current.options.find((o: OptionsItem) => o.noteName === "harmonyOne");
      expect(harmonyOneOption?.harmonicInterval).toBe(7);
    });

    it("provides initial harmonic intervals for harmony notes", () => {
      const { result } = renderHook(() => useAudio(testTime, true));

      const harmonyOneOption = result.current.options.find((o: OptionsItem) => o.noteName === "harmonyOne");
      const harmonyTwoOption = result.current.options.find((o: OptionsItem) => o.noteName === "harmonyTwo");
      
      expect(harmonyOneOption?.harmonicInterval).toBe(4); // Major third
      expect(harmonyTwoOption?.harmonicInterval).toBe(7); // Perfect fifth
    });

    it("does not provide harmonic intervals for base notes", () => {
      const { result } = renderHook(() => useAudio(testTime, true));

      const hourOption = result.current.options.find((o: OptionsItem) => o.noteName === "hour");
      const minuteOption = result.current.options.find((o: OptionsItem) => o.noteName === "minute");
      
      expect(hourOption?.harmonicInterval).toBeUndefined();
      expect(minuteOption?.harmonicInterval).toBeUndefined();
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