import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAudio } from "../hooks/useAudio";
import { startAudioEngine, getOsc, getChordOscillators } from "../audio";
import { getClockFrequency, getClockTriad } from "../utils";
import { Gain, Oscillator } from "tone";

// Mock the audio utilities
vi.mock("../audio", () => ({
  startAudioEngine: vi.fn(),
  getOsc: vi.fn(),
  getChordOscillators: vi.fn(),
}));

vi.mock("../utils", () => ({
  getClockFrequency: vi.fn(),
  getSecondsInterpolatedFrequency: vi.fn(),
  getClockTriad: vi.fn(),
  clampVolume: vi.fn((volume) => Math.max(0, Math.min(1, volume))),
  setGainVolume: vi.fn(),
}));

// Mock Tone.js
const mockOscillator = {
  frequency: { rampTo: vi.fn() },
  start: vi.fn(),
  stop: vi.fn(),
  dispose: vi.fn(),
  state: "stopped",
};

const mockGain = {
  gain: { rampTo: vi.fn() },
  dispose: vi.fn(),
  toDestination: vi.fn().mockReturnThis(),
};

vi.mock("tone", () => ({
  Gain: vi.fn(),
  Oscillator: vi.fn(),
}));

describe("useAudio Hook", () => {
  const mockTime = new Date("2024-01-01T15:30:45");

  beforeEach(() => {
    vi.clearAllMocks();
    mockOscillator.state = "stopped";

    // Setup mocks using imported functions
    vi.mocked(Gain).mockImplementation(() => mockGain as unknown as Gain);
    vi.mocked(Oscillator).mockImplementation(
      () => mockOscillator as unknown as Oscillator
    );
    vi.mocked(getOsc).mockReturnValue(mockOscillator as unknown as Oscillator);
    vi.mocked(getChordOscillators).mockReturnValue([
      mockOscillator,
      mockOscillator,
      mockOscillator,
    ] as unknown as Oscillator[]);
    vi.mocked(getClockFrequency).mockReturnValue(440);
    vi.mocked(getClockTriad).mockReturnValue({
      currentTriad: [261.63, 329.63, 392.0],
      nextTriad: [293.66, 369.99, 440.0],
    });
  });

  describe("Basic Functionality", () => {
    it("should start with sensible defaults", () => {
      const { result } = renderHook(() => useAudio(mockTime, true));

      expect(result.current.audioStarted).toBe(false);
      expect(result.current.hourVolume).toBe(0.2);
      expect(result.current.minuteVolume).toBe(0.2);
    });

    it("should provide control functions", () => {
      const { result } = renderHook(() => useAudio(mockTime, true));

      expect(typeof result.current.toggleAudio).toBe("function");
      expect(typeof result.current.setHourVolume).toBe("function");
      expect(typeof result.current.setMinuteVolume).toBe("function");
    });
  });

  describe("Audio Engine Control - The Important Stuff", () => {
    it("should start audio when requested", async () => {
      vi.mocked(startAudioEngine).mockResolvedValue(true);

      const { result } = renderHook(() => useAudio(mockTime, true));

      await act(async () => {
        await result.current.toggleAudio();
      });

      expect(result.current.audioStarted).toBe(true);
      expect(startAudioEngine).toHaveBeenCalled();
    });

    it("should stop audio when requested", async () => {
      vi.mocked(startAudioEngine).mockResolvedValue(true);

      const { result } = renderHook(() => useAudio(mockTime, true));

      // Start first
      await act(async () => {
        await result.current.toggleAudio();
      });

      // Then stop
      await act(async () => {
        await result.current.toggleAudio();
      });

      expect(result.current.audioStarted).toBe(false);
    });

    it("should handle audio start failures gracefully", async () => {
      vi.mocked(startAudioEngine).mockResolvedValue(false);

      const { result } = renderHook(() => useAudio(mockTime, true));

      await act(async () => {
        await result.current.toggleAudio();
      });

      expect(result.current.audioStarted).toBe(false);
    });
  });

  describe("Volume Control - Users Notice This", () => {
    it("should update hour volume", () => {
      const { result } = renderHook(() => useAudio(mockTime, true));

      console.log("Hook returns:", Object.keys(result.current));
      act(() => {
        result.current.setHourVolume(0.8);
      });

      expect(result.current.hourVolume).toBe(0.8);
    });

    it("should update minute volume", () => {
      const { result } = renderHook(() => useAudio(mockTime, true));

      act(() => {
        result.current.setMinuteVolume(0.6);
      });

      expect(result.current.minuteVolume).toBe(0.6);
    });

    it("should clamp volumes to valid range", () => {
      const { result } = renderHook(() => useAudio(mockTime, true));

      act(() => {
        result.current.setHourVolume(1.5);
        result.current.setMinuteVolume(-0.2);
      });

      expect(result.current.hourVolume).toBe(1.0);
      expect(result.current.minuteVolume).toBe(0.0);
    });
  });

  describe("The Stuff That Would Break Things", () => {
    it("should not crash when time is null", () => {
      expect(() => {
        renderHook(() => useAudio(null, true));
      }).not.toThrow();
    });

    it("should not crash when not mounted", () => {
      expect(() => {
        renderHook(() => useAudio(mockTime, false));
      }).not.toThrow();
    });

    it("should handle oscillator creation errors", () => {
      vi.mocked(Gain).mockImplementationOnce(() => {
        throw new Error("Tone.js failed");
      });

      expect(() => {
        renderHook(() => useAudio(mockTime, true));
      }).not.toThrow();
    });

    it("should clean up on unmount", () => {
      const { unmount } = renderHook(() => useAudio(mockTime, true));

      expect(() => unmount()).not.toThrow();
      expect(mockOscillator.dispose).toHaveBeenCalled();
      expect(mockGain.dispose).toHaveBeenCalled();
    });
  });

  describe("Integration - Does The Whole Thing Work?", () => {
    it("should update frequencies when audio is started and time changes", async () => {
      vi.mocked(startAudioEngine).mockResolvedValue(true);
      mockOscillator.state = "started";

      const { result, rerender } = renderHook(
        ({ time }) => useAudio(time, true),
        { initialProps: { time: mockTime } }
      );

      // Start audio
      await act(async () => {
        await result.current.toggleAudio();
      });

      // Change time
      const newTime = new Date("2024-01-01T16:30:45");
      rerender({ time: newTime });

      expect(getClockFrequency).toHaveBeenCalled();
      expect(mockOscillator.frequency.rampTo).toHaveBeenCalled();
    });
  });
});
