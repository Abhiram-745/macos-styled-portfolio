import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import {
  CommandContext,
  completions,
  getCompletions,
  runCommand,
} from "./commands";
import { parsePortfolio } from "../../../lib/content/schema";
import portfolio from "../../../../data/portfolio.json";
import { createContent } from "../../../../test/fixtures";

const createContext = (): CommandContext => ({
  openApp: vi.fn(),
  openUrl: vi.fn(),
  closeTerminal: vi.fn(),
  clear: vi.fn(),
  history: [],
  content: createContent(),
});

const textOf = (output: React.ReactNode) =>
  render(<>{output}</>).container.textContent;

describe("terminal commands", () => {
  it("introduces the portfolio owner", () => {
    expect(runCommand("whoami", createContext())).toBe(
      "Jane Appleseed - Engineer"
    );
  });

  it("reports unknown commands like zsh", () => {
    expect(runCommand("foo bar", createContext())).toBe(
      "zsh: command not found: foo"
    );
  });

  it("ignores empty input", () => {
    expect(runCommand("   ", createContext())).toBeNull();
  });

  it("opens apps through the window manager", () => {
    const context = createContext();
    expect(runCommand("open cv", context)).toBe("Opening CV.pdf...");
    expect(context.openApp).toHaveBeenCalledWith("preview");
  });

  it("opens links through the browser policy", () => {
    const context = createContext();
    expect(runCommand("open github", context)).toBe("Opening GitHub...");
    expect(context.openUrl).toHaveBeenCalledWith("https://github.com/jane");
  });

  it("lists experience from content", () => {
    expect(textOf(runCommand("experience", createContext()))).toContain(
      "Acme - Engineer"
    );
  });

  it("only shows contact links that exist", () => {
    const text = textOf(runCommand("contact", createContext()));
    expect(text).toContain("github");
    expect(text).not.toContain("linkedin");
  });

  it("omits unavailable contact and CV surfaces", () => {
    const context = createContext();
    delete context.content.profile.email;
    delete context.content.profile.cv;
    expect(textOf(runCommand("contact", context))).not.toContain("email");
    expect(textOf(runCommand("ls", context))).not.toContain("CV.pdf");
    expect(getCompletions(context.content)).not.toContain("open cv");
    expect(getCompletions(context.content)).not.toContain("open mail");
    expect(runCommand("open cv", context)).toContain("does not exist");
    expect(context.openApp).not.toHaveBeenCalled();
  });

  it("opens each project in Finder and autocompletes project IDs", () => {
    const context = { ...createContext(), content: parsePortfolio(portfolio) };
    for (const project of context.content.projects) {
      expect(runCommand(`open ${project.id}`, context)).toBe(
        `Opening ${project.name}...`
      );
      expect(context.openApp).toHaveBeenLastCalledWith(
        "finder",
        `project:${project.id}`
      );
      expect(getCompletions(context.content)).toContain(`open ${project.id}`);
    }
    expect(context.openUrl).not.toHaveBeenCalled();
    expect(getCompletions(context.content)).not.toContain("open cv");
  });

  it("clears and exits through the context", () => {
    const context = createContext();
    runCommand("clear", context);
    runCommand("exit", context);
    expect(context.clear).toHaveBeenCalled();
    expect(context.closeTerminal).toHaveBeenCalled();
  });

  it("autocompletes commands and arguments", () => {
    expect(completions).toContain("open projects");
    expect(completions).toContain("cat about.txt");
  });
});
