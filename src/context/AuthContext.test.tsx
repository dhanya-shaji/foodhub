import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const jsonResponse = (body: unknown, ok = true) =>
  Promise.resolve({ ok, json: () => Promise.resolve(body) } as Response);

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

describe("AuthContext", () => {
  it("loads the signed-in user on mount", async () => {
    fetchMock.mockReturnValue(
      jsonResponse({ user: { id: "1", name: "Alice", email: "a@b.com" } })
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user?.name).toBe("Alice");
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/me");
  });

  it("has no user when the session is invalid (401)", async () => {
    fetchMock.mockReturnValue(jsonResponse({ user: null }, false));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it("has no user when the network fails", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it("logout posts to the API and clears the user", async () => {
    fetchMock
      .mockReturnValueOnce(
        jsonResponse({ user: { id: "1", name: "Alice", email: "a@b.com" } })
      )
      .mockReturnValueOnce(jsonResponse({ success: true }));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.user).not.toBeNull());
    await act(async () => {
      await result.current.logout();
    });
    expect(fetchMock).toHaveBeenLastCalledWith("/api/auth/logout", {
      method: "POST",
    });
    expect(result.current.user).toBeNull();
  });

  it("throws outside the provider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(/AuthProvider/);
  });
});
