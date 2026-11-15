"use client";

import { useContent } from "../../context/content-context";
import { useWindows } from "../../context/window-context";
import Symbol from "../symbol";

export default function DesktopIntro() {
  const { profile } = useContent();
  const { openApp } = useWindows();

  return (
    <section className="absolute z-[1] bottom-24 left-6 right-6 sm:bottom-36 sm:left-12 sm:right-auto sm:max-w-md text-white">
      <p className="mb-3 text-12 font-medium tracking-[0.18em] uppercase text-white/60">
        {profile.username}&apos;s desktop
      </p>
      <h1 className="text-[32px] sm:text-[42px] font-semibold leading-tight tracking-[-0.04em]">
        {profile.name}
      </h1>
      <p className="mt-2 text-[18px] text-white/80">{profile.role}</p>
      <p className="mt-5 max-w-[340px] text-14 leading-relaxed text-white/65">
        A few things I&apos;m building, collected in one little desktop.
      </p>
      <button
        onClick={() => openApp("finder", "projects")}
        className="mt-5 inline-flex items-center gap-2 min-h-11 rounded-full border border-white/20 bg-white/10 px-5 text-14 font-medium backdrop-blur-xl transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        Open Projects{" "}
        <Symbol name="arrow-up-forward-square" className="h-3.5 w-3.5" />
      </button>
      <p className="mt-6 text-11 text-white/55">
        Adapted from{" "}
        <a
          href="https://rosh.sh/work/macos-portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white"
        >
          Roshish Shrestha&apos;s macOS portfolio
        </a>
      </p>
    </section>
  );
}
