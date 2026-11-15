"use client";

import { useEffect, useRef } from "react";
import { useContent } from "../../../context/content-context";
import { useWindows } from "../../../context/window-context";
import {
  projectIdFromHash,
  projectPayload,
  replaceProjectHash,
} from "../../../lib/project-navigation";

/** Hash links also work in the statically exported portfolio, including on reload. */
export default function ProjectNavigation() {
  const { projects } = useContent();
  const { openApp, windows } = useWindows();
  const wasFinderOpen = useRef(false);
  const isFinderOpen = windows.some((window) => window.id === "finder");

  useEffect(() => {
    if (
      wasFinderOpen.current &&
      !isFinderOpen &&
      projectIdFromHash(window.location.hash)
    )
      replaceProjectHash(null);
    wasFinderOpen.current = isFinderOpen;
  }, [isFinderOpen]);

  useEffect(() => {
    const openHash = () => {
      const id = projectIdFromHash(window.location.hash);
      if (id && projects.some((project) => project.id === id))
        openApp("finder", projectPayload(id));
    };
    openHash();
    window.addEventListener("hashchange", openHash);
    return () => window.removeEventListener("hashchange", openHash);
  }, [projects, openApp]);

  return null;
}
