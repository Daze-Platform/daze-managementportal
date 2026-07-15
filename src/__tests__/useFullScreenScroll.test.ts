import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFullScreenScroll } from "@/hooks/useFullScreenScroll";

describe("useFullScreenScroll", () => {
  beforeEach(() => {
    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("removes the orientationchange listener with the same reference it was added with", () => {
    const { unmount } = renderHook(() => useFullScreenScroll());

    const addCalls = (window.addEventListener as ReturnType<typeof vi.spyOn>)
      .mock.calls;
    const orientationAdd = addCalls.find(
      ([type]) => type === "orientationchange",
    );
    expect(orientationAdd).toBeDefined();

    unmount();

    const removeCalls = (
      window.removeEventListener as ReturnType<typeof vi.spyOn>
    ).mock.calls;
    const orientationRemove = removeCalls.find(
      ([type]) => type === "orientationchange",
    );
    expect(orientationRemove).toBeDefined();

    // The exact same function reference must be used for add and remove,
    // otherwise the browser ignores the removeEventListener call and the
    // listener accumulates on every remount.
    expect(orientationAdd![1]).toBe(orientationRemove![1]);
  });

  it("cleans up scroll and resize listeners on unmount", () => {
    const { unmount } = renderHook(() => useFullScreenScroll());
    unmount();

    const removeCalls = (
      window.removeEventListener as ReturnType<typeof vi.spyOn>
    ).mock.calls;
    const types = removeCalls.map(([type]) => type);
    expect(types).toContain("scroll");
    expect(types).toContain("resize");
    expect(types).toContain("orientationchange");
  });
});
