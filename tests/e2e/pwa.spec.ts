import { expect, test } from "@playwright/test";

test.describe("PWA", () => {
  test("serves a valid web app manifest", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.ok()).toBe(true);
    const m = await res.json();
    expect(m).toMatchObject({
      name: "FoodHub",
      start_url: "/",
      display: "standalone",
    });
    expect(m.icons.length).toBeGreaterThanOrEqual(3);
  });

  test("links the manifest and sets theme color + apple icon", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      "href",
      /manifest/
    );
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#f97316"
    );
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  });

  test("serves every icon in the manifest", async ({ request }) => {
    const m = await (await request.get("/manifest.webmanifest")).json();
    for (const icon of m.icons) {
      const res = await request.get(icon.src);
      expect(res.status(), icon.src).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
    }
  });

  test("registers and activates the service worker", async ({ page }) => {
    await page.goto("/about");
    const scope = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.ready;
      return reg.scope;
    });
    expect(scope).toMatch(/\/$/);
  });

  test("renders the offline page", async ({ page }) => {
    await page.goto("/offline");
    await expect(page.getByRole("heading", { name: /offline/i })).toBeVisible();
  });

  test("shows a visited page offline and /offline for unvisited ones", async ({
    page,
    context,
  }) => {
    await page.goto("/about");
    await page.evaluate(() => navigator.serviceWorker.ready);
    // The worker must control the page and have the offline page cached.
    await page.reload();
    await expect
      .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
      .toBe(true);

    await context.setOffline(true);

    await page.reload();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("body")).not.toContainText("ERR_INTERNET_DISCONNECTED");

    await page.goto("/contact").catch(() => {});
    await expect(page.getByRole("heading", { name: /offline/i })).toBeVisible();
    await context.setOffline(false);
  });

  test("never stores auth or order API responses in the cache", async ({ page }) => {
    await page.route("**/api/auth/me", (r) =>
      r.fulfill({ status: 401, json: { user: null } })
    );
    await page.goto("/about");
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.evaluate(() => fetch("/api/auth/me").catch(() => {}));

    const cached = await page.evaluate(async () => {
      const urls: string[] = [];
      for (const name of await caches.keys()) {
        for (const req of await (await caches.open(name)).keys()) urls.push(req.url);
      }
      return urls;
    });
    expect(cached.length).toBeGreaterThan(0);
    expect(cached.some((u) => /\/api\/(auth|orders)/.test(u))).toBe(false);
  });
});
