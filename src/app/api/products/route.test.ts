// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const getAllProducts = vi.hoisted(() => vi.fn());
vi.mock("@/lib/products", () => ({ getAllProducts }));

import { GET } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("GET /api/products", () => {
  it("returns the product list", async () => {
    getAllProducts.mockResolvedValue([{ id: 1, name: "Pizza" }]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ products: [{ id: 1, name: "Pizza" }] });
  });

  it("500 when fetching fails", async () => {
    getAllProducts.mockRejectedValue(new Error("db"));
    const res = await GET();
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Unable to fetch products");
  });
});
