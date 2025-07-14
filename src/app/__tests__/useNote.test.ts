import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useNote } from "../hooks/useNote";

describe("useNote", () => {
  it("creates a note with the correct properties", () => {
    const { result } = renderHook(() => 
      useNote("test-id", "Test Note", "hour", 5)
    );

    expect(result.current.id).toBe("test-id");
    expect(result.current.name).toBe("Test Note");
    expect(result.current.timeType).toBe("hour");
    expect(result.current.harmonicInterval).toBe(5);
  });

  it("creates a note without harmonic interval", () => {
    const { result } = renderHook(() => 
      useNote("test-id", "Test Note", "minute")
    );

    expect(result.current.id).toBe("test-id");
    expect(result.current.name).toBe("Test Note");
    expect(result.current.timeType).toBe("minute");
    expect(result.current.harmonicInterval).toBeUndefined();
  });

  it("provides refs for oscillator and gain", () => {
    const { result } = renderHook(() => 
      useNote("test-id", "Test Note", "hour")
    );

    expect(result.current.oscillatorRef).toBeDefined();
    expect(result.current.gainRef).toBeDefined();
    expect(result.current.oscillatorRef.current).toBeNull();
    expect(result.current.gainRef.current).toBeNull();
  });

  it("maintains stable refs across rerenders", () => {
    const { result, rerender } = renderHook(() => 
      useNote("test-id", "Test Note", "hour")
    );

    const initialOscRef = result.current.oscillatorRef;
    const initialGainRef = result.current.gainRef;

    rerender();

    expect(result.current.oscillatorRef).toBe(initialOscRef);
    expect(result.current.gainRef).toBe(initialGainRef);
  });
});