import React, { useEffect, useRef } from "react";
import type { Project } from "../../../lib/content/schema";
import { parseYearMonth } from "../../../lib/content/dates";
import Symbol from "../../symbol";

const accents: Record<string, string> = {
  pythe: "from-indigo-500 to-violet-600",
  blertly: "from-amber-400 to-orange-500",
  pico: "from-cyan-400 to-blue-600",
  vistara: "from-emerald-400 to-teal-600",
};

export default function ProjectDetail({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  const articleRef = useRef<HTMLElement>(null);
  useEffect(
    () => articleRef.current?.focus({ preventScroll: true }),
    [project.id]
  );

  const links = project.links.length
    ? project.links
    : project.link
      ? [{ label: "Website", href: project.link }]
      : [];

  return (
    <article
      key={project.id}
      ref={articleRef}
      tabIndex={-1}
      onKeyDown={(event) => {
        if (
          (event.metaKey && event.key === "ArrowUp") ||
          (event.altKey && event.key === "ArrowLeft")
        ) {
          event.preventDefault();
          onBack();
        }
      }}
      aria-label={`${project.name} project details`}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain select-text outline-none bg-[#fafafa] dark:bg-[#211e24]"
    >
      <div className="mx-auto max-w-[740px] px-5 py-6 sm:px-9 sm:py-8">
        <button
          onClick={onBack}
          className="mb-5 min-h-11 rounded-lg px-2 -ml-2 text-14 text-[#0066cc] dark:text-[#75b7ff] hover:bg-black/5 dark:hover:bg-white/5"
        >
          <span aria-hidden="true">← </span>All projects
        </button>

        <header className="flex items-start gap-4">
          <div
            aria-hidden="true"
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-semibold text-white shadow-md ${accents[project.id] ?? "from-blue-400 to-indigo-600"}`}
          >
            {project.name.slice(0, 1)}
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="mb-1 text-12 font-medium uppercase tracking-widest text-black/50 dark:text-white/50">
              {project.category || project.company}
            </p>
            <h1 className="break-words text-[28px] font-semibold leading-tight tracking-tight">
              {project.name}
            </h1>
          </div>
        </header>

        <p className="mt-6 text-[17px] leading-relaxed text-black/75 dark:text-white/80">
          {project.description}
        </p>

        <dl className="mt-6 grid gap-4 rounded-xl border border-black/[0.08] bg-white p-4 text-14 dark:border-white/10 dark:bg-white/[0.035] sm:grid-cols-2">
          <div>
            <dt className="mb-1 text-12 text-black/50 dark:text-white/50">
              Role
            </dt>
            <dd className="leading-relaxed">
              {project.role || project.company}
            </dd>
          </div>
          {project.start && (
            <div>
              <dt className="mb-1 text-12 text-black/50 dark:text-white/50">
                Started
              </dt>
              <dd>
                {new Intl.DateTimeFormat("en", {
                  month: "long",
                  year: "numeric",
                }).format(parseYearMonth(project.start))}
              </dd>
            </div>
          )}
          {project.result && (
            <div className="sm:col-span-2">
              <dt className="mb-1 text-12 text-black/50 dark:text-white/50">
                Status
              </dt>
              <dd className="leading-relaxed">{project.result}</dd>
            </div>
          )}
        </dl>

        <div aria-label="Project tags" className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-black/[0.06] bg-black/[0.035] px-2.5 py-1 text-12 text-black/65 dark:border-white/[0.06] dark:bg-white/[0.06] dark:text-white/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <section
          aria-label="About the project"
          className="mt-8 space-y-5 text-15 leading-[1.8] text-black/75 dark:text-white/75"
        >
          {project.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        {project.announcement && (
          <section className="mt-8 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.06] p-5">
            <p className="mb-2 text-11 font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">
              Public announcement
            </p>
            <h2 className="text-17 font-semibold">
              {project.announcement.title}
            </h2>
            <p className="mt-2 text-14 leading-relaxed text-black/70 dark:text-white/70">
              {project.announcement.description}
            </p>
            <a
              href={project.announcement.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-14 font-medium text-[#0066cc] dark:text-[#75b7ff] underline decoration-current/30 underline-offset-4"
            >
              Read the announcement{" "}
              <Symbol
                name="arrow-up-forward-square"
                className="h-3.5 w-3.5 shrink-0"
              />
            </a>
          </section>
        )}

        {links.length > 0 && (
          <nav
            aria-label={`${project.name} links`}
            className="mt-8 flex flex-wrap gap-2 border-t border-black/[0.07] pt-6 dark:border-white/10"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-14 text-[#0066cc] shadow-sm hover:bg-black/[0.025] dark:border-white/10 dark:bg-white/5 dark:text-[#75b7ff] dark:hover:bg-white/10"
              >
                <span className="break-words">{link.label}</span>
                <Symbol
                  name="arrow-up-forward-square"
                  className="h-3.5 w-3.5 shrink-0"
                />
              </a>
            ))}
          </nav>
        )}
        <p className="mt-8 pb-3 text-11 text-black/40 dark:text-white/40">
          abhiram / projects / {project.id}
        </p>
      </div>
    </article>
  );
}
