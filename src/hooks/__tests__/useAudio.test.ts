import { renderHook, act } from "@testing-library/react";
import { useAudio } from "../../hooks/useAudio";
import { describe, it, expect, vi, beforeAll } from "vitest";

// Mock Tone.js for all required classes and methods
vi.mock('tone', () => ({
  Reverb: vi.fn().mockImplementation(() => ({
    toDestination: vi.fn().mockReturnThis(),
    connect: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
  })),
  Gain: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockReturnThis(),
    gain: { value: 0 },
    dispose: vi.fn(),
  })),
  Oscillator: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockReturnThis(),
    start: vi.fn().mockReturnThis(),
    stop: vi.fn().mockReturnThis(),
    frequency: { value: 0 },
    type: '',
    dispose: vi.fn(),
  })),
  now: () => 0,
}));

// Mock startAudioEngine to always resolve to true
import * as audioUtils from "@/utils/audio";

beforeAll(() => {
  vi.spyOn(audioUtils, "startAudioEngine").mockResolvedValue(true);
});

describe("useAudio", () => {
  it("renders without crashing", () => {
    const { result } = renderHook(() => useAudio(new Date()));
    expect(result.current).toBeDefined();
  });

  it("updates volume for a note", () => {
    const { result } = renderHook(() => useAudio(new Date()));
    act(() => {
      result.current.updateVolume("toneOne", 0.8);
    });
    expect(result.current.notes.find(n => n.id === "toneOne")?.volume).toBe(0.8);
  });

  it("updates harmonic interval for a note", () => {
    const { result } = renderHook(() => useAudio(new Date()));
    act(() => {
      result.current.updateHarmonicInterval("toneOne", 5);
    });
    expect(result.current.notes.find(n => n.id === "toneOne")?.harmonicInterval).toBe(5);
  });

  it("updates note type for a note", () => {
    const { result } = renderHook(() => useAudio(new Date()));
    act(() => {
      result.current.updateNoteType("toneOne", "minute");
    });
    expect(result.current.notes.find(n => n.id === "toneOne")?.timeType).toBe("minute");
  });

  it("cleans up resources on unmount", () => {
    const { unmount } = renderHook(() => useAudio(new Date()));
    expect(() => unmount()).not.toThrow();
  });

  it("handles null time without crashing", () => {
    expect(() => {
      renderHook(() => useAudio(null));
    }).not.toThrow();
  });

  it("handles unmounted state without crashing", () => {
    expect(() => {
      renderHook(() => useAudio(new Date()));
    }).not.toThrow();
  });
});