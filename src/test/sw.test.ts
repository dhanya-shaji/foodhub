// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

type Listener = (event: Record<string, unknown>) => void;

/** Minimal in-memory Cache Storage so the real public/sw.js can run in Node. */
function makeCaches() {
  const stores = new Map<string, Map<string, Response>>();
  const open = async (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const s = stores.get(name)!;
    const key = (r: Request | string) =>
      typeof r === "string" ? new URL(r, "https://app.test").href : r.url;
    return {
      match: async (r: Request | string) => s.get(key(r))?.clone(),
      put: async (r: Request, res: Response) => void s.set(key(r), res),
      add: async (url: string) =>
        void s.set(new URL(url, "https://app.test").href, new Response("offline-page")),
    };
  };
  return {
    stores,
    open,
    keys: async () => [...stores.keys()],
    delete: async (n: string) => stores.delete(n),
  };
}

function loadSw() {
  const listeners: Record<string, Listener> = {};
  const caches = makeCaches();
  const fetchMock = vi.fn();
  const self = {
    location: { origin: "https://app.test" },
    skipWaiting: vi.fn(),
    clients: { claim: vi.fn() },
    addEventListener: (type: string, fn: Listener) => void (listeners[type] = fn),
  };
  const code = readFileSync(join(process.cwd(), "public/sw.js"), "utf8");
  new Function("self", "caches", "fetch", code)(self, caches, fetchMock);

  /** Dispatch a fetch event; returns the promise given to respondWith (or null). */
  const dispatchFetch = (
    url: string,
    init: { method?: string; mode?: string } = {}
  ) => {
    let responded: Promise<Response> | null = null;
    listeners.fetch({
      request: { method: init.method ?? "GET", url, mode: init.mode ?? "no-cors" },
      respondWith: (p: Promise<Response>) => void (responded = p),
    });
    return responded as Promise<Response> | null;
  };
  const wait = async (type: string) => {
    let p: Promise<unknown> = Promise.resolve();
    listeners[type]({ waitUntil: (x: Promise<unknown>) => void (p = x) });
    await p;
  };
  return { self, caches, fetchMock, dispatchFetch, wait };
}

let sw: ReturnType<typeof loadSw>;
beforeEach(() => {
  sw = loadSw();
});

describe("sw.js lifecycle", () => {
  it("pre-caches /offline and skips waiting on install", async () => {
    await sw.wait("install");
    const page = await sw.caches.open("foodhub-pages-v1");
    expect(await page.match("https://app.test/offline")).toBeDefined();
    expect(sw.self.skipWaiting).toHaveBeenCalled();
  });

  it("deletes old foodhub caches but keeps current and foreign ones on activate", async () => {
    await sw.caches.open("foodhub-static-v0");
    await sw.caches.open("foodhub-static-v1");
    await sw.caches.open("someone-elses-cache");
    await sw.wait("activate");
    const names = await sw.caches.keys();
    expect(names).not.toContain("foodhub-static-v0");
    expect(names).toContain("foodhub-static-v1");
    expect(names).toContain("someone-elses-cache");
    expect(sw.self.clients.claim).toHaveBeenCalled();
  });
});

describe("sw.js never touches sensitive requests", () => {
  it.each([
    ["POST to orders", "https://app.test/api/orders", "POST"],
    ["POST to login", "https://app.test/api/auth/login", "POST"],
    ["GET auth/me", "https://app.test/api/auth/me", "GET"],
    ["GET orders", "https://app.test/api/orders", "GET"],
    ["cross-origin image", "https://images.unsplash.com/a.jpg", "GET"],
  ])("ignores %s", (_n, url, method) => {
    expect(sw.dispatchFetch(url, { method })).toBeNull();
  });

  it("ignores non-navigation page assets it has no rule for", () => {
    expect(sw.dispatchFetch("https://app.test/some.json")).toBeNull();
  });
});

describe("sw.js caching strategies", () => {
  it("cache-first for static assets: network once, then cache", async () => {
    sw.fetchMock.mockResolvedValue(new Response("js", { status: 200 }));
    const url = "https://app.test/_next/static/chunk.js";
    await sw.dispatchFetch(url);
    await sw.dispatchFetch(url);
    expect(sw.fetchMock).toHaveBeenCalledTimes(1);
  });

  it("stale-while-revalidate for /api/products serves cache and refreshes", async () => {
    const url = "https://app.test/api/products";
    sw.fetchMock.mockResolvedValueOnce(new Response("v1"));
    expect(await (await sw.dispatchFetch(url))!.text()).toBe("v1");

    sw.fetchMock.mockResolvedValueOnce(new Response("v2"));
    expect(await (await sw.dispatchFetch(url))!.text()).toBe("v1"); // stale
    await new Promise((r) => setTimeout(r, 0));
    sw.fetchMock.mockRejectedValueOnce(new Error("offline"));
    expect(await (await sw.dispatchFetch(url))!.text()).toBe("v2"); // refreshed, works offline
  });

  it("network-first for navigations and caches the page", async () => {
    sw.fetchMock.mockResolvedValue(new Response("about-page"));
    const res = await sw.dispatchFetch("https://app.test/about", { mode: "navigate" });
    expect(await res!.text()).toBe("about-page");
  });

  it("falls back to the cached page, then /offline, when the network is down", async () => {
    await sw.wait("install"); // caches /offline
    sw.fetchMock.mockResolvedValueOnce(new Response("about-page"));
    await sw.dispatchFetch("https://app.test/about", { mode: "navigate" });

    sw.fetchMock.mockRejectedValue(new Error("offline"));
    const visited = await sw.dispatchFetch("https://app.test/about", { mode: "navigate" });
    expect(await visited!.text()).toBe("about-page");

    const unvisited = await sw.dispatchFetch("https://app.test/cart", { mode: "navigate" });
    expect(await unvisited!.text()).toBe("offline-page");
  });
});
