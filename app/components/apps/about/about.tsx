"use client";

import React from "react";
import { useContent } from "../../../context/content-context";
import { useWindows } from "../../../context/window-context";
import { useOpenTarget } from "../../../hooks/use-open-file";
import Symbol from "../../symbol";
import Avatar from "../../avatar";
import { Toolbar } from "../../window/toolbar";

const About: React.FC = () => {
  const { profile } = useContent();
  const { links } = profile;
  const openTarget = useOpenTarget();
  const { openApp } = useWindows();

  const actions = [
    ...(profile.email
      ? [{ label: "mail", symbol: "envelope", onClick: () => openApp("mail") }]
      : []),
    ...(profile.cv
      ? [{ label: "CV", symbol: "doc", onClick: () => openApp("preview") }]
      : []),
    ...(links.github
      ? [
          {
            label: "GitHub",
            symbol: "globe",
            onClick: () => openTarget({ type: "url", url: links.github! }),
          },
        ]
      : []),
    {
      label: "projects",
      symbol: "folder",
      onClick: () => openApp("finder", "projects"),
    },
    { label: "notes", symbol: "note-text", onClick: () => openApp("notes") },
  ];

  const fields = [
    { label: "focus", value: profile.focus.join(", ") },
    ...(profile.email
      ? [
          {
            label: "email",
            value: profile.email,
            href: `mailto:${profile.email}`,
          },
        ]
      : []),
    { label: "homepage", href: links.website },
    { label: "GitHub", href: links.github },
    { label: "LinkedIn", href: links.linkedin },
  ]
    .filter((field) => field.value || field.href)
    .map((field) => ({
      ...field,
      value:
        field.value ??
        field.href!.replace(/https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
    }));

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#282025]">
      <Toolbar hasControls />
      <div className="flex-grow overflow-y-auto px-5 sm:px-8 pb-8">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 text-36" />
          <div className="text-24 font-bold mt-3">{profile.name}</div>
          <div className="text-black/50 dark:text-white/50">{profile.role}</div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="flex flex-col items-center gap-1 w-14 min-h-12 cursor-default group"
              >
                <span className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[#0a84ff] group-hover:bg-black/10 dark:group-hover:bg-white/15">
                  <Symbol name={action.symbol} className="w-4 h-4" />
                </span>
                <span className="text-11 text-[#0a84ff]">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="selectable mt-6 border-t border-black/5 dark:border-white/10 pt-3">
          {fields.map(({ label, value, href }) => (
            <div key={label} className="flex gap-3 leading-7 min-w-0">
              <div className="w-16 sm:w-28 shrink-0 text-right text-black/45 dark:text-white/45">
                {label}
              </div>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 break-words text-[#0a84ff]"
                >
                  {value}
                </a>
              ) : (
                <div className="min-w-0 break-words">{value}</div>
              )}
            </div>
          ))}
          <div className="flex gap-3 leading-6 mt-2">
            <div className="w-16 sm:w-28 shrink-0 text-right text-black/45 dark:text-white/45">
              about
            </div>
            <div className="space-y-3 text-black/80 dark:text-white/80">
              <p>{profile.summary}</p>
              {profile.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-12 text-black/45 dark:text-white/45">
          Desktop template by{" "}
          <a
            href="https://rosh.sh/work/macos-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Roshish Shrestha
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default About;
