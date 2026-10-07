// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const Contact = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/models/Contact", () => ({ Contact }));

import { POST } from "./route";

const req = (body: unknown) =>
  new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const valid = {
  name: "Bob",
  email: "bob@x.com",
  message: "Hello there",
  subject: "order",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  Contact.create.mockImplementation(async (d) => ({
    _id: "c1",
    createdAt: new Date(0),
    ...d,
  }));
});

describe("POST /api/contact", () => {
  it.each([
    [{ ...valid, name: "" }],
    [{ ...valid, email: "" }],
    [{ ...valid, message: "" }],
  ])("400 when a required field is missing", async (body) => {
    expect((await POST(req(body))).status).toBe(400);
  });

  it("400 for an invalid email", async () => {
    const res = await POST(req({ ...valid, email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/valid email/);
  });

  it("400 for a message under 5 characters", async () => {
    const res = await POST(req({ ...valid, message: "hi" }));
    expect(res.status).toBe(400);
  });

  it("201 and stores a trimmed, lower-cased record", async () => {
    const res = await POST(
      req({ ...valid, name: "  Bob ", email: " BOB@X.com " })
    );
    expect(res.status).toBe(201);
    expect(Contact.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Bob", email: "bob@x.com", status: "new" })
    );
    expect((await res.json()).contact.id).toBe("c1");
  });

  it("falls back to 'general' for unknown subjects", async () => {
    await POST(req({ ...valid, subject: "hack" }));
    expect(Contact.create).toHaveBeenCalledWith(
      expect.objectContaining({ subject: "general" })
    );
  });

  it("500 when the database fails", async () => {
    Contact.create.mockRejectedValue(new Error("boom"));
    expect((await POST(req(valid))).status).toBe(500);
  });
});
