import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { createContent } from "../../../../test/fixtures";
import ProjectNavigation from "./project-navigation";

const state = vi.hoisted(() => ({
  windows: [] as { id: string }[],
  openApp: vi.fn(),
}));
const content = createContent();

vi.mock("../../../context/content-context", () => ({
  useContent: () => content,
}));
vi.mock("../../../context/window-context", () => ({ useWindows: () => state }));

afterEach(() => {
  cleanup();
  state.windows = [];
  state.openApp.mockClear();
  window.history.replaceState(null, "", "/");
});

describe("project link lifecycle", () => {
  it("opens a valid project when the page first loads with a hash", () => {
    window.history.replaceState(null, "", "/#projects/rocket");
    render(<ProjectNavigation />);
    expect(state.openApp).toHaveBeenCalledWith("finder", "project:rocket");
  });

  it("ignores unknown project IDs", () => {
    window.history.replaceState(null, "", "/#projects/missing");
    render(<ProjectNavigation />);
    expect(state.openApp).not.toHaveBeenCalled();
  });

  it("clears the URL on close so the same project link can be opened again", () => {
    window.history.replaceState(null, "", "/#projects/rocket");
    const { rerender } = render(<ProjectNavigation />);
    state.windows = [{ id: "finder" }];
    rerender(<ProjectNavigation />);
    state.windows = [];
    rerender(<ProjectNavigation />);
    expect(window.location.hash).toBe("");
    window.history.replaceState(null, "", "/#projects/rocket");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    expect(state.openApp).toHaveBeenCalledTimes(2);
  });
});
