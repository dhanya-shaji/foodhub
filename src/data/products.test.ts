// @vitest-environment node
import { describe, expect, it } from "vitest";
import { MENU_CATEGORIES, SEED_PRODUCTS } from "./products";

describe("SEED_PRODUCTS", () => {
  it("has unique ids", () => {
    const ids = SEED_PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has valid names, positive prices and https image urls", () => {
    for (const p of SEED_PRODUCTS) {
      expect(p.name.trim()).not.toBe("");
      expect(p.price).toBeGreaterThan(0);
      expect(p.imageUrl).toMatch(/^https:\/\//);
    }
  });

  it("only uses known menu categories", () => {
    for (const p of SEED_PRODUCTS) {
      expect(MENU_CATEGORIES).toContain(p.category);
    }
  });

  it("covers every menu category", () => {
    const used = new Set(SEED_PRODUCTS.map((p) => p.category));
    for (const c of MENU_CATEGORIES) expect(used.has(c)).toBe(true);
  });

  it("includes the featured home-page products (1, 4, 7)", () => {
    const ids = SEED_PRODUCTS.map((p) => p.id);
    expect(ids).toEqual(expect.arrayContaining([1, 4, 7]));
  });
});
