import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOptions } from "../hooks/useOptions";
import { Gain } from "tone";

vi.mock("../utils", () => ({
  clampVolume: vi.fn((volume) => Math.max(0, Math.min(1, volume))),
  setGainVolume: vi.fn(),
}));

// Create a proper mock for Tone.js Gain
const createMockGain = () => ({
  gain: { rampTo: vi.fn() },
  connect: vi.fn().mockReturnThis(),
  disconnect: vi.fn(),
  dispose: vi.fn(),
  toDestination: vi.fn().mockReturnThis(),
  name: "MockGain",
  input: {},
  output: {},
  _gainNode: {},
});

vi.mock("tone", () => ({
  Gain: vi.fn(() => createMockGain()),
}));

describe("useOptions", () => {
  // Create mock refs that match the expected type
  const createMockGainRef = () => ({ 
    current: createMockGain() as unknown as Gain
  });
  
  const defaultProps = [
    {
      initialVolume: 0.5,
      noteName: "hour",
      noteType: "hour" as const,
      gainRef: createMockGainRef(),
      initialHarmonicInterval: 0,
    },
    {
      initialVolume: 0.3,
      noteName: "harmonyOne",
      noteType: "minute" as const,
      gainRef: createMockGainRef(),
      initialHarmonicInterval: 4,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with correct default values", () => {
    const { result } = renderHook(() => useOptions(defaultProps));

    expect(result.current.options).toHaveLength(2);
    expect(result.current.options[0]).toMatchObject({
      noteName: "hour",
      volume: 0.5,
      noteType: "hour",
      harmonicInterval: 0,
    });
    expect(result.current.options[1]).toMatchObject({
      noteName: "harmonyOne",
      volume: 0.3,
      noteType: "minute",
      harmonicInterval: 4,
    });
  });

  describe("volume control", () => {
    it("updates volume for specified note", () => {
      const { result } = renderHook(() => useOptions(defaultProps));

      act(() => {
        result.current.updateVolume("hour", 0.8);
      });

      const hourOption = result.current.options.find(o => o.noteName === "hour");
      expect(hourOption?.volume).toBe(0.8);
    });

    it("gets volume for specified note", () => {
      const { result } = renderHook(() => useOptions(defaultProps));

      const volume = result.current.getVolume("hour");
      expect(volume).toBe(0.5);
    });

    it("returns 0 for non-existent note", () => {
      const { result } = renderHook(() => useOptions(defaultProps));

      const volume = result.current.getVolume("nonexistent");
      expect(volume).toBe(0);
    });
  });

  describe("harmonic interval control", () => {
    it("updates harmonic interval for specified note", () => {
      const { result } = renderHook(() => useOptions(defaultProps));

      act(() => {
        result.current.updateHarmonicInterval("harmonyOne", 7);
      });

      const harmonyOption = result.current.options.find(o => o.noteName === "harmonyOne");
      expect(harmonyOption?.harmonicInterval).toBe(7);
    });

    it("gets harmonic interval for specified note", () => {
      const { result } = renderHook(() => useOptions(defaultProps));

      const interval = result.current.getHarmonicInterval("harmonyOne");
      expect(interval).toBe(4);
    });

    it("returns undefined for note without harmonic interval", () => {
      const { result } = renderHook(() => useOptions(defaultProps));

      const interval = result.current.getHarmonicInterval("nonexistent");
      expect(interval).toBeUndefined();
    });
  });

  describe("note type control", () => {
    it("updates note type for specified note", () => {
      const { result } = renderHook(() => useOptions(defaultProps));

      act(() => {
        result.current.updateNoteType("harmonyOne", "hour");
      });

      const harmonyOption = result.current.options.find(o => o.noteName === "harmonyOne");
      expect(harmonyOption?.noteType).toBe("hour");
    });
  });

  describe("edge cases", () => {
    it("handles empty options array", () => {
      const { result } = renderHook(() => useOptions([]));

      expect(result.current.options).toHaveLength(0);
      expect(result.current.getVolume("any")).toBe(0);
    });

    it("handles updating non-existent note gracefully", () => {
      const { result } = renderHook(() => useOptions(defaultProps));

      expect(() => {
        act(() => {
          result.current.updateVolume("nonexistent", 0.5);
          result.current.updateHarmonicInterval("nonexistent", 5);
          result.current.updateNoteType("nonexistent", "hour");
        });
      }).not.toThrow();
    });

    it("handles missing gainRef gracefully", () => {
      const propsWithNullGain = [
        {
          initialVolume: 0.5,
          noteName: "test",
          noteType: "hour" as const,
          gainRef: { current: null },
          initialHarmonicInterval: 0,
        },
      ];

      const { result } = renderHook(() => useOptions(propsWithNullGain));

      expect(() => {
        act(() => {
          result.current.updateVolume("test", 0.8);
        });
      }).not.toThrow();

      // Volume should not update when gainRef is null
      const testOption = result.current.options.find(o => o.noteName === "test");
      expect(testOption?.volume).toBe(0.5); // Should remain unchanged
    });
  });
});