"use client";

import React from "react";
import { useContent } from "../../../context/content-context";
import { Toolbar, ToolbarButton, ToolbarGroup } from "../../window/toolbar";

const Preview: React.FC = () => {
  const { profile } = useContent();

  const download = () => {
    if (!profile.cv) return;
    const link = document.createElement("a");
    link.href = profile.cv;
    link.download = `${profile.name} - CV.pdf`;
    link.click();
  };

  if (!profile.cv)
    return (
      <div className="h-full flex flex-col bg-white dark:bg-[#282025]">
        <Toolbar hasControls title="Preview" />
        <p className="p-6 text-black/60 dark:text-white/60">
          No document is available to preview.
        </p>
      </div>
    );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#282025]">
      <Toolbar
        hasControls
        title={
          <div className="leading-tight">
            <div>CV.pdf</div>
            <div className="text-11 font-normal text-black/50 dark:text-white/50">
              Page 1 of 1
            </div>
          </div>
        }
        trailing={
          <ToolbarGroup>
            <ToolbarButton
              symbol="square-and-arrow-down"
              title="Download"
              onClick={download}
            />
            <ToolbarButton
              symbol="arrow-up-forward-square"
              title="Open in New Tab"
              onClick={() =>
                window.open(profile.cv, "_blank", "noopener,noreferrer")
              }
            />
          </ToolbarGroup>
        }
      />
      <iframe
        src={`${profile.cv}#view=FitH&toolbar=0&navpanes=0`}
        title="CV"
        className="flex-grow w-full bg-[#525659]"
      />
    </div>
  );
};

export default Preview;
