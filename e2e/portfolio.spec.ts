import { test, expect, type Page, type Locator } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const names = ["Pythe", "Blertly", "Pico", "Vistara AI"];
const ids = ["pythe", "blertly", "pico", "vistara"];

async function openApp(page: Page, name: string, touch: boolean) {
  if (touch) {
    await page.getByRole("button", { name: "Show Dock", exact: true }).tap();
    await page
      .getByRole("navigation", { name: "Dock", exact: true })
      .getByRole("button", { name, exact: true })
      .tap();
  } else {
    await page
      .getByRole("navigation", { name: "Dock", exact: true })
      .getByRole("button", { name, exact: true })
      .click();
  }
}

async function noOverflow(page: Page, container?: Locator) {
  const documentOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  expect(documentOverflow).toBeLessThanOrEqual(1);
  if (container) {
    const measured = (await container.locator("[data-window-body]").count())
      ? container.locator("[data-window-body]")
      : container;
    expect(
      await measured.evaluate((el) => el.scrollWidth - el.clientWidth)
    ).toBeLessThanOrEqual(1);
    const box = await container.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(
      page.viewportSize()!.width + 1
    );
  }
}

async function screenshot(page: Page, name: string) {
  const dir = process.env.PORTFOLIO_SCREENSHOT_DIR;
  if (!dir) return;
  await page.locator("[data-mobile-dock-panel]").waitFor({ state: "detached" });
  await mkdir(dir, { recursive: true });
  await page.screenshot({
    path: `${dir}/${name}.png`,
    fullPage: true,
    animations: "disabled",
  });
}

test.beforeEach(async ({ page }) => {
  // Skip only the decorative boot sequence; exercise the real exported application.
  await page.addInitScript(() => sessionStorage.setItem("booted", "true"));
});

test("desktop, Finder and every project are readable and reloadable", async ({
  page,
  isMobile,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Abhiram Kakarla" })
  ).toBeVisible();
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.getByRole("option", { name: "CV.pdf" })).toHaveCount(0);
  await screenshot(page, `${info.project.name}-desktop`);
  await page
    .getByRole("button", { name: "Open Projects", exact: false })
    .click();
  const finder = page.getByRole("dialog", { name: "Finder", exact: true });
  await expect(finder).toBeVisible();
  await expect(
    finder.getByRole("option", { name: "Pythe", exact: true })
  ).toBeVisible();
  await noOverflow(page, finder);
  await screenshot(page, `${info.project.name}-finder`);
  for (let i = 0; i < names.length; i++) {
    const item = finder.getByRole("option", { name: names[i], exact: true });
    if (isMobile) await item.tap();
    else await item.dblclick();
    const details = finder.getByRole("article", {
      name: `${names[i]} project details`,
    });
    await expect(details).toBeVisible();
    await expect(
      details.getByRole("heading", { name: names[i], exact: true })
    ).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`#projects/${ids[i]}$`));
    await noOverflow(page, finder);
    await noOverflow(page, details);
    if (i === 0) {
      await expect(details).toContainText(
        "In development, getting ready for launch."
      );
      await screenshot(page, `${info.project.name}-pythe`);
      const announcement = details.getByRole("link", {
        name: "Read the announcement",
      });
      await announcement.scrollIntoViewIfNeeded();
      await expect(announcement).toHaveAttribute(
        "href",
        /linkedin.com\/posts\/daiwik-khedekar_/
      );
      await expect(details).toContainText("10 builders in one villa");
      await screenshot(page, `${info.project.name}-announcement`);
    }
    if (i === 1 || i === 3)
      await expect(details).toContainText("Reported November 2026");
    if (i === 3) await expect(details.locator("nav")).toHaveCount(0);
    for (const link of await details.locator("a").all()) {
      await expect(link).toHaveAttribute("href", /^https:\/\//);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
    await page.reload();
    await expect(
      page.getByRole("article", { name: `${names[i]} project details` })
    ).toBeVisible();
    await page
      .getByRole("button", { name: "All projects", exact: false })
      .click();
    await expect(
      finder.getByRole("option", { name: "Pythe", exact: true })
    ).toBeVisible();
    await expect(page).not.toHaveURL(/#projects\//);
  }
  expect(errors).toEqual([]);
});

test("Spotlight opens a project with the keyboard", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Abhiram Kakarla" })
  ).toBeVisible();
  await page.keyboard.press("Control+k");
  await page.getByRole("textbox", { name: "Spotlight Search" }).fill("Blertly");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("article", { name: "Blertly project details" })
  ).toBeVisible();
  await expect(page).toHaveURL(/#projects\/blertly$/);
});

test("Notes project links reopen after Finder closes and awards stay absent", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Abhiram Kakarla" })
  ).toBeVisible();
  await openApp(page, "Notes", isMobile);
  const notes = page.getByRole("dialog", { name: "Notes", exact: true });
  await expect(notes.getByText("Honors & Awards")).toHaveCount(0);
  await notes.getByRole("button", { name: /Pythe/ }).click();
  const link = notes.getByRole("link", { name: /Open project in Finder/ });
  await link.click();
  const finder = page.getByRole("dialog", { name: "Finder", exact: true });
  await expect(
    finder.getByRole("article", { name: "Pythe project details" })
  ).toBeVisible();
  await finder.getByRole("button", { name: "Close", exact: true }).click();
  await expect(finder).toHaveCount(0);
  await link.click();
  await expect(
    page.getByRole("article", { name: "Pythe project details" })
  ).toBeVisible();
  await finder.getByRole("button", { name: "Minimize", exact: true }).click();
  await link.click();
  await expect(finder).toHaveCSS("pointer-events", "auto");
  await expect(
    finder.getByRole("article", { name: "Pythe project details" })
  ).toBeVisible();
});

test("Terminal opens projects internally and unavailable CV/contact commands are safe", async ({
  page,
  isMobile,
}, info) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Abhiram Kakarla" })
  ).toBeVisible();
  await openApp(page, "Terminal", isMobile);
  const terminal = page.getByRole("dialog", { name: "Terminal", exact: true });
  const input = terminal.locator("input");
  for (const command of [
    "whoami",
    "awards",
    "contact",
    "open cv",
    "projects",
  ]) {
    await input.fill(command);
    await input.press("Enter");
  }
  await expect(terminal).toContainText("Abhiram Kakarla");
  await expect(terminal.locator('a[href^="mailto:"]')).toHaveCount(0);
  await noOverflow(page, terminal);
  await noOverflow(page, terminal.locator(".selectable"));
  await screenshot(page, `${info.project.name}-terminal`);
  await input.fill("open pico");
  await input.press("Enter");
  await expect(
    page.getByRole("article", { name: "Pico project details" })
  ).toBeVisible();
  await expect(page).toHaveURL(/#projects\/pico$/);
  await page.reload();
  await expect(
    page.getByRole("article", { name: "Pico project details" })
  ).toBeVisible();
});

test("window controls close, minimise, restore and enter/exit full screen", async ({
  page,
  isMobile,
}) => {
  await page.goto("/#projects/pythe");
  const finder = page.getByRole("dialog", { name: "Finder", exact: true });
  await expect(
    finder.getByRole("article", { name: "Pythe project details" })
  ).toBeVisible();
  if (isMobile) {
    const target = await finder
      .getByRole("button", { name: "Close", exact: true })
      .boundingBox();
    expect(target!.width).toBeGreaterThanOrEqual(44);
    expect(target!.height).toBeGreaterThanOrEqual(44);
  }
  await finder.getByRole("button", { name: "Minimize", exact: true }).click();
  await expect(finder).toHaveCSS("pointer-events", "none");
  await openApp(page, "Finder", isMobile);
  await expect(finder).toHaveCSS("pointer-events", "auto");
  await finder
    .getByRole("button", { name: "Enter Full Screen", exact: true })
    .click();
  const exit = finder.getByRole("button", {
    name: "Exit Full Screen",
    exact: true,
  });
  if (!isMobile) await finder.locator(".window-controls").hover();
  await exit.click();
  await expect(
    finder.getByRole("button", { name: "Enter Full Screen", exact: true })
  ).toBeAttached();
  await finder.getByRole("button", { name: "Close", exact: true }).click();
  await expect(finder).toHaveCount(0);
});

test("unknown project hashes leave a working desktop", async ({ page }) => {
  await page.goto("/#projects/not-a-project");
  await expect(
    page.getByRole("heading", { name: "Abhiram Kakarla" })
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: /Open Projects/ }).click();
  await expect(
    page.getByRole("option", { name: "Vistara AI", exact: true })
  ).toBeVisible();
});

test("Settings panes and appearance remain usable", async ({
  page,
  isMobile,
}, info) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Abhiram Kakarla" })
  ).toBeVisible();
  await openApp(page, "System Settings", isMobile);
  const settings = page.getByRole("dialog", {
    name: "System Settings",
    exact: true,
  });
  await settings.getByRole("button", { name: "Light", exact: true }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await noOverflow(page, settings);
  if (isMobile)
    await settings
      .getByRole("combobox", { name: "Settings pane" })
      .selectOption("about");
  else
    await settings.getByRole("button", { name: "About", exact: true }).click();
  await expect(settings).toContainText("Abhiram Kakarla");
  await noOverflow(page, settings);
  await screenshot(page, `${info.project.name}-settings`);
});

test("Finder supports keyboard folder opening and desktop maximise/restore", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop keyboard and window geometry check");
  await page.goto("/");
  await page.getByRole("option", { name: "Projects", exact: true }).focus();
  await page.keyboard.press("Enter");
  const finder = page.getByRole("dialog", { name: "Finder", exact: true });
  await finder.getByRole("option", { name: "Pythe", exact: true }).click();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("article", { name: "Pythe project details" })
  ).toBeVisible();
  await page.keyboard.press("Alt+ArrowLeft");
  await expect(
    finder.getByRole("option", { name: "Pythe", exact: true })
  ).toBeVisible();
  const before = await finder.boundingBox();
  await finder
    .getByRole("button", { name: "Enter Full Screen", exact: true })
    .click({ modifiers: ["Alt"] });
  await expect.poll(async () => (await finder.boundingBox())!.width).toBe(1280);
  await finder
    .getByRole("button", { name: "Enter Full Screen", exact: true })
    .click({ modifiers: ["Alt"] });
  await expect
    .poll(async () => (await finder.boundingBox())!.width)
    .toBe(before!.width);
  const header = await finder.locator(".handle").last().boundingBox();
  await page.mouse.move(header!.x + header!.width / 2, header!.y + 26);
  await page.mouse.down();
  await page.mouse.move(header!.x + header!.width / 2 + 50, header!.y + 56, {
    steps: 5,
  });
  await page.mouse.up();
  await expect
    .poll(async () => (await finder.boundingBox())!.x)
    .toBeGreaterThan(before!.x + 30);
  const moved = await finder.boundingBox();
  await page.mouse.move(
    moved!.x + moved!.width + 1,
    moved!.y + moved!.height + 1
  );
  await page.mouse.down();
  await page.mouse.move(
    moved!.x + moved!.width + 51,
    moved!.y + moved!.height + 31,
    { steps: 5 }
  );
  await page.mouse.up();
  await expect
    .poll(async () => (await finder.boundingBox())!.width)
    .toBeGreaterThan(moved!.width + 30);
});

test("desktop icons drag without opening and project content scrolls by touch", async ({
  page,
  isMobile,
  context,
}) => {
  test.skip(!isMobile, "Touch gesture check");
  await page.goto("/");
  const icon = page.getByRole("option", { name: "Projects", exact: true });
  await expect(icon).toBeVisible();
  const origin = await icon.boundingBox();
  const cdp = await context.newCDPSession(page);
  const startX = Math.round(origin!.x + origin!.width / 2);
  const startY = Math.round(origin!.y + 40);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: startX, y: startY }],
  });
  for (let step = 1; step <= 8; step++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: startX - step * 12, y: startY + step * 3 }],
    });
    await page.waitForTimeout(16);
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect
    .poll(async () => (await icon.boundingBox())!.x)
    .toBeLessThan(origin!.x - 60);
  await icon.tap();
  await page
    .getByRole("dialog", { name: "Finder", exact: true })
    .getByRole("option", { name: "Pythe", exact: true })
    .tap();
  const details = page.getByRole("article", { name: "Pythe project details" });
  await expect(details).toBeVisible();
  const box = await details.boundingBox();
  const x = Math.round(box!.x + box!.width / 2);
  const y = Math.round(box!.y + box!.height - 80);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  for (let step = 1; step <= 8; step++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: y - step * 35 }],
    });
    await page.waitForTimeout(16);
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => details.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100);
  await cdp.detach();
});
