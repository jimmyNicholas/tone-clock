import { renderHook, act } from "@testing-library/react";
import { useTime } from "../../hooks/useTime";
import { describe, it, expect, vi } from "vitest";

describe("useTime", () => {
  it("returns a valid time and timezone on mount", () => {
    const { result } = renderHook(() => useTime());
    expect(result.current.time).toBeInstanceOf(Date);
    expect(typeof result.current.selectedTimezone).toBe("number");
  });

  it("updates timezone when setSelectedTimezone is called", () => {
    const { result } = renderHook(() => useTime());
    act(() => {
      result.current.setSelectedTimezone(5);
    });
    expect(result.current.selectedTimezone).toBe(5);
  });

  it("updates time over interval", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTime());
    const initialTime = result.current.time?.getTime();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.time?.getTime()).not.toBe(initialTime);
    vi.useRealTimers();
  });
}); 