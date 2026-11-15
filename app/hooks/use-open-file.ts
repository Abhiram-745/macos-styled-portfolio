import { useCallback } from "react";
import { useWindows } from "../context/window-context";
import { Location, OpenTarget } from "../lib/file-system";
import { canEmbed } from "../lib/browser";
import {
  projectIdFromPayload,
  replaceProjectHash,
} from "../lib/project-navigation";

export function useOpenTarget(onOpenFolder?: (location: Location) => void) {
  const { openApp } = useWindows();

  return useCallback(
    (target: OpenTarget) => {
      switch (target.type) {
        case "app": {
          const projectId =
            target.app === "finder" && projectIdFromPayload(target.payload);
          if (projectId) replaceProjectHash(projectId);
          return openApp(target.app, target.payload);
        }
        case "url":
          return canEmbed(target.url)
            ? openApp("safari", target.url)
            : window.open(target.url, "_blank", "noopener,noreferrer");
        case "folder":
          return onOpenFolder
            ? onOpenFolder(target.location)
            : openApp("finder", target.location);
      }
    },
    [openApp, onOpenFolder]
  );
}
