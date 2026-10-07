// @vitest-environment node
import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

const User = vi.hoisted(() => ({ findOne: vi.fn(), create: vi.fn() }));
const auth = vi.hoisted(() => ({
  createToken: vi.fn(),
  setAuthCookie: vi.fn(),
  clearAuthCookie: vi.fn(),
  getSession: vi.fn(),
}));
vi.mock("@/lib/mongodb", () => ({ connectDB: vi.fn() }));
vi.mock("@/models/User", () => ({ User }));
vi.mock("@/lib/auth", () => auth);

import { POST as register } from "./register/route";
import { POST as login } from "./login/route";
import { POST as logout } from "./logout/route";
import { GET as me } from "./me/route";

const post = (body: unknown) =>
  new Request("http://localhost/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

beforeEach(() => {
  vi.clearAllMocks();
  auth.createToken.mockResolvedValue("token");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/auth/register", () => {
  it("400 when fields are missing", async () => {
    const res = await register(post({ email: "a@b.com" }));
    expect(res.status).toBe(400);
  });

  it("400 for short passwords", async () => {
    const res = await register(post({ name: "A", email: "a@b.com", password: "123" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/6 characters/);
  });

  it("409 when the email is taken", async () => {
    User.findOne.mockResolvedValue({ _id: "1" });
    const res = await register(
      post({ name: "A", email: "a@b.com", password: "secret1" })
    );
    expect(res.status).toBe(409);
  });

  it("201, hashes the password, normalises email and sets the cookie", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockImplementation(async (d) => ({
      _id: { toString: () => "id1" },
      ...d,
    }));
    const res = await register(
      post({ name: " Alice ", email: " A@B.com ", password: "secret1" })
    );
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({
      user: { id: "id1", name: "Alice", email: "a@b.com" },
    });
    const created = User.create.mock.calls[0][0];
    expect(created.password).not.toBe("secret1");
    expect(await bcrypt.compare("secret1", created.password)).toBe(true);
    expect(auth.setAuthCookie).toHaveBeenCalledWith("token");
  });

  it("500 on unexpected errors", async () => {
    User.findOne.mockRejectedValue(new Error("db down"));
    const res = await register(
      post({ name: "A", email: "a@b.com", password: "secret1" })
    );
    expect(res.status).toBe(500);
  });
});

describe("POST /api/auth/login", () => {
  it("400 when fields are missing", async () => {
    expect((await login(post({ email: "a@b.com" }))).status).toBe(400);
  });

  it("401 for unknown user", async () => {
    User.findOne.mockResolvedValue(null);
    const res = await login(post({ email: "a@b.com", password: "x" }));
    expect(res.status).toBe(401);
  });

  it("401 for wrong password, with the same message as unknown user", async () => {
    User.findOne.mockResolvedValue({
      password: await bcrypt.hash("right-pass", 4),
    });
    const res = await login(post({ email: "a@b.com", password: "wrong" }));
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe("Invalid email or password");
  });

  it("200 and sets the cookie for valid credentials", async () => {
    User.findOne.mockResolvedValue({
      _id: { toString: () => "id1" },
      name: "Alice",
      email: "a@b.com",
      password: await bcrypt.hash("right-pass", 4),
    });
    const res = await login(post({ email: "A@B.com", password: "right-pass" }));
    expect(res.status).toBe(200);
    expect(User.findOne).toHaveBeenCalledWith({ email: "a@b.com" });
    expect((await res.json()).user).toEqual({
      id: "id1",
      name: "Alice",
      email: "a@b.com",
    });
    expect(auth.setAuthCookie).toHaveBeenCalled();
  });

  it("never returns the password hash", async () => {
    User.findOne.mockResolvedValue({
      _id: { toString: () => "id1" },
      name: "Alice",
      email: "a@b.com",
      password: await bcrypt.hash("p@ssword", 4),
    });
    const res = await login(post({ email: "a@b.com", password: "p@ssword" }));
    expect(JSON.stringify(await res.json())).not.toMatch(/password|\$2/);
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the cookie", async () => {
    const res = await logout();
    expect(auth.clearAuthCookie).toHaveBeenCalled();
    expect(await res.json()).toEqual({ success: true });
  });
});

describe("GET /api/auth/me", () => {
  it("401 without a session", async () => {
    auth.getSession.mockResolvedValue(null);
    const res = await me();
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ user: null });
  });

  it("returns the session user", async () => {
    auth.getSession.mockResolvedValue({
      userId: "u1",
      name: "Alice",
      email: "a@b.com",
    });
    const res = await me();
    expect(await res.json()).toEqual({
      user: { id: "u1", name: "Alice", email: "a@b.com" },
    });
  });
});
