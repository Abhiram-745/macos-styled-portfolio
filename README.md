# Abhiram's desktop

Abhiram Kakarla's personal portfolio, adapted from **Roshish Shrestha's [macOS styled portfolio](https://github.com/R0shish/macos-styled-portfolio)** ([project write-up](https://rosh.sh/work/macos-portfolio)). This repository is Abhiram's actual fork: [Abhiram-745/macos-styled-portfolio](https://github.com/Abhiram-745/macos-styled-portfolio).

The desktop keeps Finder, windows, a dock, Notes, Terminal, Spotlight, System Settings and keyboard shortcuts. Projects open into their own readable portfolio detail views. On touch screens, tap desktop icons and project folders to open them; on desktop, double-click or use the keyboard.

## Run locally

```bash
npm ci
npm run dev
```

Open the local address printed by Next.js. No account or paid service is required.

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run format:check
```

For repeatable real-browser checks of the exported app at 1280px, 390px and 320px:

```bash
npx playwright install chromium
npm run build
npm run test:e2e
```

To use an existing Chromium installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable path. Set `PORTFOLIO_SCREENSHOT_DIR` to save the browser captures. The suite checks project reloads, touch opening, keyboard search, window controls, Notes, Terminal, Settings and horizontal overflow. It runs a local static server only; it does not publish anything.

`npm run build` exports the static application to `out/`. The content API is also exported, so the portfolio does not need a separate backend.

The tested dependency checkpoint uses Next.js and `eslint-config-next` 15.5.29 (the supported Maintenance LTS line), Zod 4.6.7, and a scoped override of Next's PostCSS to 8.5.33. Next 14 is unsupported; its 14.2.35 backport still matches current advisories. `npm audit --omit=dev` reported zero production vulnerabilities on 15 November 2026. Recheck advisories before a future public deployment.

## Content

Edit [`data/portfolio.json`](data/portfolio.json). Its validated contract is in [`app/lib/content/schema.ts`](app/lib/content/schema.ts).

- `site` controls the page title and description.
- `profile` supplies Abhiram's identity and bio. Email, CV and career start are optional; absent data hides the corresponding personal surfaces.
- `projects` supplies the Finder folders and their detail views: category, role, summary, grounded tags, links, longer paragraphs and status. Keep claims accurate and date user counts rather than implying live analytics.
- `experiences` and `awards` may remain empty. Project and co-founder roles are described in the projects themselves.
- `system` controls appearance, the wallpaper and welcome message.

The public project links are provided as content. Pythe's virtual-computer features are in development for launch. Its before0 section links the public residency announcement; it does not claim the residency happened or that attendees used the product. Blertly's 500 users and Vistara AI's 100 users were reported in November 2026.

There is no personal email or CV supplied for this adaptation. Do not reintroduce the original author's personal information or a fallback CV.

## Architecture

`ContentSource` loads validated content from `/api/portfolio` by default. A different content API can be configured through `NEXT_PUBLIC_CONTENT_API_URL`, provided it returns the same schema and allows the site's origin.

```text
app/components/apps/      Finder, project details, Notes, Terminal and other apps
app/components/window/    Window controls, dragging and resizing
app/context/              Desktop, files, content and window state
app/lib/content/          Content contract and loading
app/lib/file-system.ts    Shared virtual file entries
```

The app registry is lazy-loaded. Windows retain close, minimise and maximise controls. Finder's virtual file system also feeds desktop icons, Quick Look and Spotlight. Project hash links work in a static export and survive reloads.

## Deployment is manual

Automatic GitHub Pages deployment on push has been removed from `.github/workflows/publish.yml`. That workflow can run only through **Run workflow**, and this task does not run it. CI checks pull requests without publishing them.

[`vercel.json`](vercel.json) sets `git.deploymentEnabled` to `false` so this branch does not request automatic Vercel Git deployments. No Vercel project, domain, integration, account setting or existing deployment was changed by this implementation.

For a future preview, create a **separate new Vercel project** using this fork and the intended branch. Do not import into or reconnect an existing portfolio project. Review the project's free-plan limits and settings yourself; no paid service is needed. Keep Git deployment disabled unless you intentionally choose to enable it. An explicit deployment in the new project is separate from pushing this repository.

## Credits and asset provenance

The desktop implementation originated with **Roshish Shrestha**. Keep the visible template credit and this attribution when customising it. The upstream README invites cloning and customisation, but the source has **no standalone root LICENSE**. This fork is not labelled MIT and does not assert a new licence for the upstream code.

The bundled Apple app icons, SF Symbol images, Apple logo and SF font files have been removed or replaced. The interface now uses system font stacks: it only uses a platform's installed system fonts, with ordinary sans-serif and monospace fallbacks. The replacement app/file artwork and inline interface glyphs are original, simple geometric drawings made for this adaptation. Editable SVG sources are in [`app/assets/originals`](app/assets/originals); PNG exports preserve the original component import paths. The startup mark and favicon use Abhiram's AK initials.

This remains a macOS-inspired portfolio, not an Apple product or an official Apple interface.
