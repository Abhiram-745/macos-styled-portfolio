import { describe, expect, it } from "vitest";
import {
  buildFileEntries,
  getLocationTitle,
  isLocation,
  listLocation,
} from "./file-system";
import { createContent } from "../../test/fixtures";

const content = createContent();
const entries = buildFileEntries(content);
const fileState = (trashed: string[] = []) => ({
  trashed,
  isVisible: (id: string) => !trashed.includes(id),
});
const ids = (list: { id: string }[]) => list.map((entry) => entry.id);

describe("file system", () => {
  it("validates locations", () => {
    expect(isLocation("projects")).toBe(true);
    expect(isLocation("tag:Flutter")).toBe(true);
    expect(isLocation("nowhere")).toBe(false);
    expect(isLocation(undefined)).toBe(false);
  });

  it("titles the home folder with the username", () => {
    expect(getLocationTitle("home", "jane")).toBe("jane");
    expect(getLocationTitle("tag:Mobile", "jane")).toBe("Mobile");
  });

  it("lists projects and filters them by tag", () => {
    expect(ids(listLocation("projects", entries, "jane", fileState()))).toEqual(
      ["rocket", "secret"]
    );
    expect(
      ids(listLocation("tag:Golang", entries, "jane", fileState()))
    ).toEqual(["secret"]);
  });

  it("moves trashed files out of their folder and into the Trash", () => {
    const state = fileState(["rocket", "cv"]);
    expect(ids(listLocation("projects", entries, "jane", state))).toEqual([
      "secret",
    ]);
    expect(ids(listLocation("documents", entries, "jane", state))).toEqual([]);
    expect(ids(listLocation("trash", entries, "jane", state))).toEqual([
      "cv",
      "rocket",
    ]);
  });

  it("opens every project in its own Finder detail view, including projects without links", () => {
    const [rocket, secret] = entries.projects;
    expect(rocket.open).toEqual({
      type: "app",
      app: "finder",
      payload: "project:rocket",
    });
    expect(secret.open).toEqual({
      type: "app",
      app: "finder",
      payload: "project:secret",
    });
  });

  it("omits the CV and contact apps when no CV or email is supplied", () => {
    const without = buildFileEntries(
      createContent({
        profile: { ...content.profile, cv: undefined, email: undefined },
      })
    );
    expect(without.cv).toBeNull();
    for (const location of [
      "desktop",
      "documents",
      "downloads",
      "recents",
      "trash",
    ] as const) {
      expect(
        ids(listLocation(location, without, "jane", fileState(["cv"])))
      ).not.toContain("cv");
    }
    expect(ids(without.applications)).not.toContain("preview");
    expect(ids(without.applications)).not.toContain("mail");
  });

  it("protects applications and folders from rename and trash", () => {
    const [finder] = entries.applications;
    expect(finder.canTrash).toBe(false);
    expect(finder.canRename).toBe(false);
  });
});
