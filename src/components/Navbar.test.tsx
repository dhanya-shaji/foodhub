import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push, refresh }),
}));

const auth = vi.hoisted(() => ({
  user: null as null | { id: string; name: string; email: string },
  loading: false,
  logout: vi.fn(),
}));
vi.mock("@/context/AuthContext", () => ({ useAuth: () => auth }));

import Navbar from "./Navbar";
import { StoreProvider, useStore } from "@/context/StoreContext";

function AddItem() {
  const { addToCart } = useStore();
  return (
    <button
      onClick={() =>
        addToCart({ id: 1, name: "P", price: 1, imageUrl: "u", category: "c" }, 3)
      }
    >
      seed
    </button>
  );
}

const setup = () =>
  render(
    <StoreProvider>
      <Navbar />
      <AddItem />
    </StoreProvider>
  );

beforeEach(() => {
  vi.clearAllMocks();
  auth.user = null;
  auth.loading = false;
});

describe("Navbar", () => {
  it("shows the main navigation links", () => {
    setup();
    for (const [label, href] of [
      ["Home", "/"],
      ["About", "/about"],
      ["Menu", "/product"],
      ["Contact", "/contact"],
    ]) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href
      );
    }
  });

  it("offers Sign In when logged out", () => {
    setup();
    expect(screen.getAllByRole("link", { name: "Sign In" })[0]).toHaveAttribute(
      "href",
      "/login"
    );
    expect(screen.queryByRole("button", { name: "Log out" })).toBeNull();
  });

  it("shows the first name and Log out when logged in", async () => {
    auth.user = { id: "1", name: "Alice Smith", email: "a@b.com" };
    setup();
    expect(screen.getByRole("link", { name: "Alice" })).toHaveAttribute(
      "href",
      "/profile"
    );
    await userEvent.click(screen.getByRole("button", { name: "Log out" }));
    expect(auth.logout).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/");
  });

  it("shows a cart badge with the item count", async () => {
    setup();
    await userEvent.click(screen.getByText("seed"));
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
  });

  it("opens and closes the mobile menu (button and Escape)", async () => {
    setup();
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(document.getElementById("mobile-menu")).toBeNull();
  });
});
