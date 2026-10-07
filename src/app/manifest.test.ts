// @vitest-environment node
import { describe, expect, it } from "vitest";
import manifest from "./manifest";

describe("PWA manifest", () => {
  const m = manifest();

  it("is installable (name, start_url, standalone display)", () => {
    expect(m.name).toBe("FoodHub");
    expect(m.short_name).toBe("FoodHub");
    expect(m.start_url).toBe("/");
    expect(m.display).toBe("standalone");
  });

  it("has 192 and 512 icons plus a maskable icon", () => {
    const sizes = m.icons?.map((i) => i.sizes);
    expect(sizes).toEqual(expect.arrayContaining(["192x192", "512x512"]));
    expect(m.icons?.some((i) => i.purpose === "maskable")).toBe(true);
  });

  it("points at icon files that exist in public/", async () => {
    const { existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    for (const icon of m.icons ?? []) {
      expect(existsSync(join(process.cwd(), "public", icon.src))).toBe(true);
    }
  });
});
