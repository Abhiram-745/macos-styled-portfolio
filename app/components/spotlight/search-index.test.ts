import { describe, expect, it } from "vitest";
import { buildSearchIndex, searchIndex } from "./search-index";
import { createContent } from "../../../test/fixtures";

const index = buildSearchIndex(createContent());
const titles = (query: string) => searchIndex(index, query).map((r) => r.title);

describe("spotlight search", () => {
  it("returns nothing for an empty query", () => {
    expect(searchIndex(index, "   ")).toEqual([]);
  });

  it("matches titles and subtitles case-insensitively", () => {
    expect(titles("rocket")).toEqual(["Rocket"]);
    expect(titles("FLUTTER")).toEqual(["Rocket"]);
  });

  it("requires every word to match", () => {
    expect(titles("acme golang")).toEqual(["Secret"]);
  });

  it("only indexes links that exist", () => {
    expect(titles("github")).toEqual(["GitHub"]);
    expect(titles("linkedin")).toEqual([]);
  });

  it("omits CV and Mail when no contact information was supplied", () => {
    const content = createContent();
    delete content.profile.email;
    delete content.profile.cv;
    const results = buildSearchIndex(content);
    expect(results.find((result) => result.id === "cv")).toBeUndefined();
    expect(
      results.find((result) => result.id === "app-preview")
    ).toBeUndefined();
    expect(results.find((result) => result.id === "app-mail")).toBeUndefined();
  });

  it("opens project detail views in Finder", () => {
    const [rocket] = searchIndex(index, "rocket");
    expect(rocket.target).toEqual({
      type: "app",
      app: "finder",
      payload: "project:rocket",
    });
  });
});
