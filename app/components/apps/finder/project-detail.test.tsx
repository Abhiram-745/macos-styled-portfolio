import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ProjectDetail from "./project-detail";
import { parsePortfolio } from "../../../lib/content/schema";
import data from "../../../../data/portfolio.json";

afterEach(cleanup);
const projects = parsePortfolio(data).projects;

describe("project detail views", () => {
  it.each(projects)(
    "renders substantive content for $name inside the portfolio",
    (project) => {
      const onBack = vi.fn();
      render(<ProjectDetail project={project} onBack={onBack} />);
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        project.name
      );
      expect(screen.getByText(project.description)).toBeTruthy();
      expect(screen.getByText(project.role)).toBeTruthy();
      for (const paragraph of project.paragraphs)
        expect(screen.getByText(paragraph)).toBeTruthy();
      fireEvent.click(screen.getByRole("button", { name: /All projects/ }));
      expect(onBack).toHaveBeenCalledOnce();
      for (const anchor of screen.queryAllByRole("link")) {
        expect(anchor.getAttribute("href")).toMatch(/^https:\/\//);
        expect(anchor.getAttribute("rel")).toContain("noopener");
      }
    }
  );

  it("supports keyboard return from a focused project view", () => {
    const onBack = vi.fn();
    render(<ProjectDetail project={projects[0]} onBack={onBack} />);
    const article = screen.getByRole("article");
    expect(document.activeElement).toBe(article);
    fireEvent.keyDown(article, { key: "ArrowUp", metaKey: true });
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("includes the real public residency announcement link", () => {
    render(
      <ProjectDetail
        project={projects.find((project) => project.id === "pythe")!}
        onBack={() => {}}
      />
    );
    const announcement = screen.getByRole("link", {
      name: /Read the announcement/,
    });
    expect(announcement.getAttribute("href")).toContain(
      "activity-7477098853398151169-yUsP"
    );
    expect(screen.getByText(/food and travel/)).toBeTruthy();
  });

  it("keeps dated user counts separate from live analytics", () => {
    const { container } = render(
      <ProjectDetail
        project={projects.find((project) => project.id === "blertly")!}
        onBack={() => {}}
      />
    );
    expect(container.textContent).toContain("500");
    expect(container.textContent).toContain("November 2026");
  });
});
