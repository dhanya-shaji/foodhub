// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const model = vi.hoisted(() => ({
  countDocuments: vi.fn(),
  insertMany: vi.fn(),
  updateOne: vi.fn(),
  find: vi.fn(),
  findOne: vi.fn(),
}));
vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/models/Product", () => ({ Product: model }));

import { SEED_PRODUCTS } from "@/data/products";
import {
  ensureProductsSeeded,
  getAllProducts,
  getProductById,
  serializeProduct,
} from "./products";

const doc = {
  _id: "x",
  id: 1,
  name: "Pizza",
  price: 9,
  imageUrl: "https://i/x.jpg",
  category: "Pizza",
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => vi.clearAllMocks());

describe("serializeProduct", () => {
  it("keeps only public fields", () => {
    const out = serializeProduct(doc as never);
    expect(out).toEqual({
      id: 1,
      name: "Pizza",
      price: 9,
      imageUrl: "https://i/x.jpg",
      category: "Pizza",
    });
    expect(out).not.toHaveProperty("_id");
  });
});

describe("ensureProductsSeeded", () => {
  it("inserts the catalog when the collection is empty", async () => {
    model.countDocuments.mockResolvedValue(0);
    const res = await ensureProductsSeeded();
    expect(model.insertMany).toHaveBeenCalledWith(SEED_PRODUCTS);
    expect(res).toEqual({ seeded: true, count: SEED_PRODUCTS.length });
  });

  it("upserts each seed product when data already exists", async () => {
    model.countDocuments.mockResolvedValue(5);
    model.updateOne.mockResolvedValue({});
    const res = await ensureProductsSeeded();
    expect(model.insertMany).not.toHaveBeenCalled();
    expect(model.updateOne).toHaveBeenCalledTimes(SEED_PRODUCTS.length);
    expect(model.updateOne.mock.calls[0][2]).toEqual({ upsert: true });
    expect(res).toEqual({ seeded: false, count: 5 });
  });
});

describe("getAllProducts / getProductById", () => {
  beforeEach(() => {
    model.countDocuments.mockResolvedValue(1);
    model.updateOne.mockResolvedValue({});
  });

  it("returns serialized products sorted by id", async () => {
    const sort = vi.fn().mockReturnValue({ lean: () => Promise.resolve([doc]) });
    model.find.mockReturnValue({ sort });
    const products = await getAllProducts();
    expect(sort).toHaveBeenCalledWith({ id: 1 });
    expect(products).toHaveLength(1);
    expect(products[0]).not.toHaveProperty("_id");
  });

  it("finds one product by id", async () => {
    model.findOne.mockReturnValue({ lean: () => Promise.resolve(doc) });
    expect(await getProductById(1)).toMatchObject({ id: 1, name: "Pizza" });
    expect(model.findOne).toHaveBeenCalledWith({ id: 1 });
  });

  it("returns null when not found", async () => {
    model.findOne.mockReturnValue({ lean: () => Promise.resolve(null) });
    expect(await getProductById(999)).toBeNull();
  });
});
