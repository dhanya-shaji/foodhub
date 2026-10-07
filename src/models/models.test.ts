// @vitest-environment node
import { describe, expect, it } from "vitest";
import { User } from "./User";
import { Contact } from "./Contact";
import { Order } from "./Order";
import { Product } from "./Product";

const errorsOf = (doc: { validateSync: () => { errors: object } | undefined }) =>
  Object.keys(doc.validateSync()?.errors ?? {});

describe("User model", () => {
  it("requires name, email and password", () => {
    expect(errorsOf(new User({}))).toEqual(
      expect.arrayContaining(["name", "email", "password"])
    );
  });

  it("enforces a 6 character password and lowercases email", () => {
    const u = new User({ name: "A", email: "A@B.COM", password: "123" });
    expect(errorsOf(u)).toContain("password");
    expect(u.email).toBe("a@b.com");
  });

  it("accepts a valid user", () => {
    expect(
      errorsOf(new User({ name: "A", email: "a@b.com", password: "secret1" }))
    ).toEqual([]);
  });
});

describe("Contact model", () => {
  it("requires name, email and message", () => {
    expect(errorsOf(new Contact({}))).toEqual(
      expect.arrayContaining(["name", "email", "message"])
    );
  });

  it("defaults subject and status, rejects unknown subject", () => {
    const c = new Contact({ name: "A", email: "a@b.com", message: "hello" });
    expect(c.subject).toBe("general");
    expect(c.status).toBe("new");
    c.subject = "bogus";
    expect(errorsOf(c)).toContain("subject");
  });

  it("rejects messages over 5000 chars", () => {
    const c = new Contact({
      name: "A",
      email: "a@b.com",
      message: "x".repeat(5001),
    });
    expect(errorsOf(c)).toContain("message");
  });
});

describe("Product model", () => {
  it("rejects negative prices", () => {
    const p = new Product({
      id: 1,
      name: "x",
      price: -1,
      imageUrl: "u",
      category: "c",
    });
    expect(errorsOf(p)).toContain("price");
  });
});

describe("Order model", () => {
  const base = {
    userId: "507f1f77bcf86cd799439011",
    customerName: "A",
    customerEmail: "a@b.com",
    itemCount: 1,
    subtotal: 10,
    total: 12.5,
    delivery: { fullName: "A", phone: "1", address: "x", city: "y" },
  };
  const item = {
    productId: 1,
    name: "P",
    category: "Pizza",
    price: 10,
    quantity: 1,
    imageUrl: "u",
    subtotal: 10,
  };

  it("rejects an order without items", () => {
    expect(errorsOf(new Order({ ...base, items: [] }))).toContain("items");
  });

  it("defaults status pending and payment cash", () => {
    const o = new Order({ ...base, items: [item] });
    expect(errorsOf(o)).toEqual([]);
    expect(o.status).toBe("pending");
    expect(o.paymentMethod).toBe("cash");
  });

  it("rejects an invalid payment method and quantity 0", () => {
    const o = new Order({
      ...base,
      paymentMethod: "bitcoin",
      items: [{ ...item, quantity: 0 }],
    });
    const errs = errorsOf(o);
    expect(errs).toContain("paymentMethod");
    expect(errs).toContain("items.0.quantity");
  });
});
