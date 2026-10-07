import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));
const refreshUser = vi.fn();
vi.mock("@/context/AuthContext", () => ({ useAuth: () => ({ refreshUser }) }));

import LoginPage from "./page";

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

const submitButton = () => screen.getAllByRole("button", { name: /Sign In|Create Account/ })[0];

describe("Login page", () => {
  it("starts in login mode without a name field", () => {
    render(<LoginPage />);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Your name")).toBeNull();
  });

  it("logs in and redirects to the profile", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ user: {} }) });
    render(<LoginPage />);
    await userEvent.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
    await userEvent.type(screen.getByPlaceholderText("At least 6 characters"), "secret1");
    await userEvent.click(submitButton());

    expect(fetchMock.mock.calls[0][0]).toBe("/api/auth/login");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      email: "a@b.com",
      password: "secret1",
    });
    expect(refreshUser).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/profile");
  });

  it("shows the API error and does not redirect", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Invalid email or password" }),
    });
    render(<LoginPage />);
    await userEvent.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
    await userEvent.type(screen.getByPlaceholderText("At least 6 characters"), "wrong1");
    await userEvent.click(submitButton());
    expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("switches to register mode and posts name too", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ user: {} }) });
    render(<LoginPage />);
    await userEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByText("Create your account")).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText("Your name"), "Alice");
    await userEvent.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
    await userEvent.type(screen.getByPlaceholderText("At least 6 characters"), "secret1");
    await userEvent.click(screen.getByRole("button", { name: "Create Account" }));

    expect(fetchMock.mock.calls[0][0]).toBe("/api/auth/register");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      name: "Alice",
      email: "a@b.com",
      password: "secret1",
    });
  });

  it("shows a network error message", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));
    render(<LoginPage />);
    await userEvent.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
    await userEvent.type(screen.getByPlaceholderText("At least 6 characters"), "secret1");
    await userEvent.click(submitButton());
    expect(await screen.findByText(/Unable to reach the server/)).toBeInTheDocument();
  });
});
