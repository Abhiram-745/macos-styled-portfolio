import { describe, expect, it } from "vitest";
import {
  projectHash,
  projectIdFromHash,
  projectIdFromPayload,
} from "./project-navigation";

describe("direct project navigation", () => {
  it("round-trips project links on a static hosting URL", () => {
    for (const id of ["pythe", "blertly", "pico", "vistara", "a project"]) {
      expect(projectIdFromHash(projectHash(id))).toBe(id);
    }
  });

  it("ignores unrelated and malformed hash links", () => {
    for (const hash of [
      "",
      "#about",
      "#projects/",
      "#projects/%",
      "#projects/a/b",
      "#projects/a%2Fb",
    ]) {
      expect(projectIdFromHash(hash)).toBeNull();
    }
  });

  it("recognizes only nonempty project payloads", () => {
    expect(projectIdFromPayload("project:pythe")).toBe("pythe");
    expect(projectIdFromPayload("projects/pythe")).toBeNull();
    expect(projectIdFromPayload("project:")).toBeNull();
    expect(projectIdFromPayload(undefined)).toBeNull();
  });
});
