# Tested portfolio checkpoint

Verified on 15 November 2026 from Abhiram-745/macos-styled-portfolio, based on main commit b7ba2e40a2430698ac718b814bb6bba2d6e5dc8d. Branch: `feat/abhiram-portfolio`. The PR records the final commit SHA.

## Exact results

| Check                  | Result                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `npm run lint`         | Passed; no ESLint warnings or errors                                               |
| `npm run typecheck`    | Passed                                                                             |
| `npm run format:check` | Passed                                                                             |
| `npm test`             | 98 tests passed in 18 files                                                        |
| `npm run build`        | Passed with Next 15.5.29; static export in `out/`                                  |
| `npm run test:e2e`     | 24 passed, 3 platform-specific skips; Chromium at 1280x900, 320x740 and 390x844    |
| `npm audit --omit=dev` | 0 production vulnerabilities                                                       |
| Public URLs            | All seven supplied public URLs returned HTTP 200; Pythe redirects to www.pythe.app |
| `git diff --check`     | Passed                                                                             |

The skipped cases are the desktop keyboard/drag/resize/maximise check on both phones, and the native touch gesture check on desktop. Each ran successfully on its relevant platform. The browser suite uses the actual production export, not mocked project content. It skips only the decorative boot sequence.

Browser coverage includes every project's direct hash navigation and reload, internal Finder opening, dated claims, real announcement links, unknown IDs, keyboard Spotlight, desktop keyboard file opening, close/minimise/restore/full screen/maximise, window dragging and resizing, Notes same-project restore, Terminal project commands and omitted CV/contact commands, Settings, document/window/project horizontal overflow, touch taps, native icon dragging without opening, and native project scrolling.

Full command output is in [checks.txt](checks.txt), [build.txt](build.txt), [browser-tests.txt](browser-tests.txt) and [production-audit.json](production-audit.json). The production audit excludes development dependencies; no claim is made that the entire development toolchain has zero advisories.

## Dependency review

Next 14 is unsupported according to https://nextjs.org/support-policy. The suggested 14.2.35 backport still matched current critical advisories, so the checkpoint uses the supported Maintenance LTS line: Next and eslint-config-next 15.5.29, retaining React 18. Zod is patched to 4.6.7 and Next's PostCSS is scoped to 8.5.33 through an override. The lockfile is committed.

## Screenshots

These are real Chromium captures of the production export. Desktop Finder, project details, the announcement, mobile 320/390 layouts, Terminal and Settings were visually inspected. Screenshots were used to fix layering, delayed dock dismissal, missing arrow glyphs and premature captures.

| Surface              | Desktop 1280px                       | Touch 320px                       | Touch 390px                       |
| -------------------- | ------------------------------------ | --------------------------------- | --------------------------------- |
| Desktop              | [PNG](desktop-1280-desktop.png)      | [PNG](touch-320-desktop.png)      | [PNG](touch-390-desktop.png)      |
| Finder folder        | [PNG](desktop-1280-finder.png)       | [PNG](touch-320-finder.png)       | [PNG](touch-390-finder.png)       |
| Pythe detail         | [PNG](desktop-1280-pythe.png)        | [PNG](touch-320-pythe.png)        | [PNG](touch-390-pythe.png)        |
| before0 announcement | [PNG](desktop-1280-announcement.png) | [PNG](touch-320-announcement.png) | [PNG](touch-390-announcement.png) |
| Terminal             | [PNG](desktop-1280-terminal.png)     | [PNG](touch-320-terminal.png)     | [PNG](touch-390-terminal.png)     |
| Settings             | [PNG](desktop-1280-settings.png)     | [PNG](touch-320-settings.png)     | [PNG](touch-390-settings.png)     |

## Deployment and remaining limits

No site was deployed, no Vercel project was created or connected, and no existing project or live site was modified. No other repository was pushed or modified. No paid service was added.

The branch removes the inherited Pages push trigger (manual dispatch only) and disables Vercel Git deployment in vercel.json. The original Pages trigger targets only main, so this feature-branch push does not match it. GitHub listed zero registered workflows and returned 404 for a Pages site. Disabling publish.yml remotely returned 404, and reading Actions settings returned 403; repository-level Actions settings therefore remain unverified. No unrelated account settings were changed. Connect only a separate new Vercel project when independently testing or deploying.

There are no known implementation blockers from the completed checks. The browser verification uses Chromium with emulated touch viewports, not physical iOS/Android hardware. Recheck advisories before a future public deployment.

The complete changed-file inventory is in [changed-files.txt](changed-files.txt); GitHub's PR Files changed view provides the exact patch. Main areas: content/schema and optional personal surfaces; Finder project views and hash navigation; mobile desktop/windows/dock; original icons and system fonts; tests and deployment configuration; README and verification evidence.
