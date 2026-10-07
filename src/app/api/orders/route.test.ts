// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const Order = vi.hoisted(() => ({ find: vi.fn(), create: vi.fn() }));
const getSession = vi.hoisted(() => vi.fn());
const getProductById = vi.hoisted(() => vi.fn());
vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/models/Order", () => ({ Order }));
vi.mock("@/lib/auth", () => ({ getSession }));
vi.mock("@/lib/products", () => ({ getProductById }));

import { GET, POST } from "./route";

const session = {
  userId: "507f1f77bcf86cd799439011",
  name: "Alice",
  email: "a@b.com",
};

const products: Record<number, object> = {
  1: { id: 1, name: "Pizza", category: "Pizza", price: 8.99, imageUrl: "u1" },
  2: { id: 2, name: "Sushi", category: "Sushi", price: 12.5, imageUrl: "u2" },
};

const delivery = { phone: "123", address: "1 Main St", city: "Paris" };

const req = (body: unknown) =>
  new NextRequest("http://localhost/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  getSession.mockResolvedValue(session);
  getProductById.mockImplementation(async (id: number) => products[id] ?? null);
  Order.create.mockImplementation(async (d) => ({
    _id: "o1",
    createdAt: new Date(0),
    updatedAt: new Date(0),
    ...d,
  }));
});

describe("GET /api/orders", () => {
  it("401 when signed out", async () => {
    getSession.mockResolvedValue(null);
    expect((await GET()).status).toBe(401);
  });

  it("returns only the signed-in user's orders, newest first", async () => {
    const sort = vi.fn().mockReturnValue({
      lean: () =>
        Promise.resolve([{ _id: "o1", items: [], total: 5, status: "pending" }]),
    });
    Order.find.mockReturnValue({ sort });
    const res = await GET();
    expect(Order.find).toHaveBeenCalledWith({ userId: session.userId });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect((await res.json()).orders[0].id).toBe("o1");
  });
});

describe("POST /api/orders", () => {
  it("401 when signed out", async () => {
    getSession.mockResolvedValue(null);
    const res = await POST(req({ items: [{ productId: 1, quantity: 1 }], delivery }));
    expect(res.status).toBe(401);
  });

  it("400 for an empty cart", async () => {
    expect((await POST(req({ items: [], delivery }))).status).toBe(400);
  });

  it("400 when delivery details are missing", async () => {
    const res = await POST(
      req({ items: [{ productId: 1, quantity: 1 }], delivery: { phone: "1" } })
    );
    expect(res.status).toBe(400);
  });

  it("400 for an invalid payment method", async () => {
    const res = await POST(
      req({
        items: [{ productId: 1, quantity: 1 }],
        delivery,
        paymentMethod: "bitcoin",
      })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Invalid payment method");
  });

  it.each([
    [{ productId: 999, quantity: 1 }],
    [{ productId: 1, quantity: 0 }],
    [{ productId: 1, quantity: -2 }],
    [{ productId: 1, quantity: "abc" }],
  ])("400 for invalid item %j", async (item) => {
    const res = await POST(req({ items: [item], delivery }));
    expect(res.status).toBe(400);
  });

  it("computes totals from server-side prices, ignoring client prices", async () => {
    const res = await POST(
      req({
        items: [
          { productId: 1, quantity: 2, price: 0.01 },
          { productId: 2, quantity: 1 },
        ],
        delivery,
        paymentMethod: "card",
      })
    );
    expect(res.status).toBe(201);
    const { order } = await res.json();
    expect(order.subtotal).toBe(30.48); // 2 * 8.99 + 12.5
    expect(order.deliveryFee).toBe(2.5);
    expect(order.total).toBe(32.98);
    expect(order.itemCount).toBe(3);
    expect(order.status).toBe("pending");
    expect(order.paymentMethod).toBe("card");
  });

  it("attaches the order to the session user and defaults the name", async () => {
    await POST(req({ items: [{ productId: 1, quantity: 1 }], delivery }));
    const created = Order.create.mock.calls[0][0];
    expect(String(created.userId)).toBe(session.userId);
    expect(created.customerEmail).toBe("a@b.com");
    expect(created.delivery.fullName).toBe("Alice");
    expect(created.paymentMethod).toBe("cash");
  });

  it("500 when saving fails", async () => {
    Order.create.mockRejectedValue(new Error("db"));
    const res = await POST(
      req({ items: [{ productId: 1, quantity: 1 }], delivery })
    );
    expect(res.status).toBe(500);
  });
});
