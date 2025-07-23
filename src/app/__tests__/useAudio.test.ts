import { renderHook } from "@testing-library/react";
import { useAudio } from "../../hooks/useAudio";
import { describe, it, expect } from "vitest";

describe("useAudio", () => {
  it("renders without crashing", () => {
    const { result } = renderHook(() => useAudio(new Date(), true));
    expect(result.current).toBeDefined();
  });
});