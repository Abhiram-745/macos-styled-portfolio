import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildNotes } from "./notes";
import { parsePortfolio } from "../../../lib/content/schema";
import portfolio from "../../../../data/portfolio.json";

const openTarget = vi.hoisted(() => vi.fn());
vi.mock("../../../hooks/use-open-file", () => ({
  useOpenTarget: () => openTarget,
}));

const content = parsePortfolio(portfolio);

describe("portfolio notes", () => {
  afterEach(() => {
    vi.clearAllMocks();
    window.history.replaceState(null, "", "/");
  });
  it("supports a portfolio without awards, experience, email or CV", () => {
    const notes = buildNotes(content);
    expect(notes.map((note) => note.id)).not.toContain("awards");
    const { container } = render(<>{notes[0].content}</>);
    expect(container.textContent).toContain("Abhiram Kakarla");
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(container.textContent).toContain("Roshish Shrestha");
  });

  it("links all four project notes to their in-portfolio detail views", () => {
    for (const project of content.projects) {
      const note = buildNotes(content).find(
        (entry) => entry.id === `project-${project.id}`
      );
      expect(note).toBeDefined();
      const { container } = render(<>{note!.content}</>);
      expect(
        container.querySelector(`a[href="#projects/${project.id}"]`)
      ).not.toBeNull();
    }
  });
  it("explicitly opens Finder even when the project hash is already current", () => {
    window.history.replaceState(null, "", "/#projects/pythe");
    const note = buildNotes(content).find(
      (entry) => entry.id === "project-pythe"
    )!;
    const { container } = render(<>{note.content}</>);
    const link = container.querySelector<HTMLAnchorElement>(
      'a[href="#projects/pythe"]'
    )!;
    fireEvent.click(link);
    expect(openTarget).toHaveBeenCalledWith({
      type: "app",
      app: "finder",
      payload: "project:pythe",
    });
    expect(link.getAttribute("href")).toBe("#projects/pythe");
  });
});
