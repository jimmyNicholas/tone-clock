import { renderHook, act } from "@testing-library/react";
import { useAudio } from "../../hooks/useAudio";
import { describe, it, expect } from "vitest";

describe("useAudio", () => {
  it("renders without crashing", () => {
    const { result } = renderHook(() => useAudio(new Date(), true));
    expect(result.current).toBeDefined();
  });

  it("toggles audio on and off", async () => {
    const { result } = renderHook(() => useAudio(new Date(), true));
    expect(result.current.audioStarted).toBe(false);
    await act(async () => {
      result.current.toggleAudio();
    });
    expect(result.current.audioStarted).toBe(true);
    await act(async () => {
      result.current.toggleAudio();
    });
    expect(result.current.audioStarted).toBe(false);
  });

  it("updates volume for a note", () => {
    const { result } = renderHook(() => useAudio(new Date(), true));
    act(() => {
      result.current.updateVolume("toneOne", 0.8);
    });
    expect(result.current.notes.find(n => n.id === "toneOne")?.volume).toBe(0.8);
  });

  it("updates harmonic interval for a note", () => {
    const { result } = renderHook(() => useAudio(new Date(), true));
    act(() => {
      result.current.updateHarmonicInterval("toneOne", 5);
    });
    expect(result.current.notes.find(n => n.id === "toneOne")?.harmonicInterval).toBe(5);
  });

  it("updates note type for a note", () => {
    const { result } = renderHook(() => useAudio(new Date(), true));
    act(() => {
      result.current.updateNoteType("toneOne", "minute");
    });
    expect(result.current.notes.find(n => n.id === "toneOne")?.timeType).toBe("minute");
  });

  it("cleans up resources on unmount", () => {
    const { unmount } = renderHook(() => useAudio(new Date(), true));
    expect(() => unmount()).not.toThrow();
  });

  it("handles null time without crashing", () => {
    expect(() => {
      renderHook(() => useAudio(null, true));
    }).not.toThrow();
  });

  it("handles unmounted state without crashing", () => {
    expect(() => {
      renderHook(() => useAudio(new Date(), false));
    }).not.toThrow();
  });
});