// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const store = new Map<string, string>();
const cookieApi = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}));
vi.mock("next/headers", () => ({ cookies: async () => cookieApi }));

import {
  clearAuthCookie,
  createToken,
  getSession,
  setAuthCookie,
  verifyToken,
} from "./auth";

const payload = { userId: "u1", email: "a@b.com", name: "Alice" };

beforeEach(() => {
  store.clear();
  cookieApi.get.mockImplementation((name: string) =>
    store.has(name) ? { value: store.get(name) } : undefined
  );
  cookieApi.set.mockClear();
  cookieApi.delete.mockClear();
});

describe("tokens", () => {
  it("round-trips the payload", async () => {
    const token = await createToken(payload);
    expect(await verifyToken(token)).toMatchObject(payload);
  });

  it("rejects a tampered token", async () => {
    const token = await createToken(payload);
    await expect(verifyToken(token.slice(0, -2) + "xx")).rejects.toThrow();
  });

  it("rejects garbage", async () => {
    await expect(verifyToken("not.a.jwt")).rejects.toThrow();
  });

  it("throws when JWT_SECRET is missing", async () => {
    const original = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    await expect(createToken(payload)).rejects.toThrow(/JWT_SECRET/);
    process.env.JWT_SECRET = original;
  });
});

describe("cookies", () => {
  it("sets an httpOnly lax cookie valid for 7 days", async () => {
    await setAuthCookie("tok");
    expect(cookieApi.set).toHaveBeenCalledWith(
      "foodhub_token",
      "tok",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 604800,
      })
    );
  });

  it("clears the cookie", async () => {
    await clearAuthCookie();
    expect(cookieApi.delete).toHaveBeenCalledWith("foodhub_token");
  });
});

describe("getSession", () => {
  it("returns null with no cookie", async () => {
    expect(await getSession()).toBeNull();
  });

  it("returns the session for a valid cookie", async () => {
    store.set("foodhub_token", await createToken(payload));
    expect(await getSession()).toMatchObject(payload);
  });

  it("returns null for an invalid cookie", async () => {
    store.set("foodhub_token", "bad");
    expect(await getSession()).toBeNull();
  });
});
