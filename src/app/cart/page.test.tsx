import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
const auth = vi.hoisted(() => ({
  user: null as null | { id: string; name: string; email: string },
}));
vi.mock("@/context/AuthContext", () => ({ useAuth: () => auth }));

import CartPage from "./page";
import { StoreProvider } from "@/context/StoreContext";

const pizza = { id: 1, name: "Pizza", price: 10, imageUrl: "u", category: "Pizza" };

let fetchMock: ReturnType<typeof vi.fn>;

function setup(cart: unknown[] = [{ ...pizza, quantity: 2 }]) {
  localStorage.setItem("foodhub_cart", JSON.stringify(cart));
  return render(
    <StoreProvider>
      <CartPage />
    </StoreProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  auth.user = null;
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

describe("Cart page", () => {
  it("shows the empty state", async () => {
    setup([]);
    expect(await screen.findByText("Your cart is empty.")).toBeInTheDocument();
  });

  it("lists items and totals including the delivery fee", async () => {
    setup();
    expect((await screen.findAllByText("Pizza")).length).toBeGreaterThan(0);
    // 2 x 10 = 20 subtotal, +2.50 delivery
    expect(screen.getAllByText(/22\.50/).length).toBeGreaterThan(0);
  });

  it("asks guests to sign in before checkout", async () => {
    setup();
    const button = await screen.findByRole("button", { name: "Sign in to checkout" });
    expect(button).toBeDisabled();
  });

  it("places an order for a signed-in user, clears the cart and redirects", async () => {
    auth.user = { id: "1", name: "Alice", email: "a@b.com" };
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ order: {} }) });
    setup();

    await userEvent.type(await screen.findByPlaceholderText("Alice"), "Alice");
    await userEvent.type(screen.getByPlaceholderText("Phone number"), "123");
    await userEvent.type(screen.getByPlaceholderText("Street address"), "1 Main St");
    await userEvent.type(screen.getByPlaceholderText("City"), "Paris");
    await userEvent.click(screen.getByRole("button", { name: "Place order" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/orders");
    const body = JSON.parse(init.body);
    expect(body.items).toEqual([{ productId: 1, quantity: 2 }]);
    expect(body.delivery).toMatchObject({
      fullName: "Alice",
      phone: "123",
      address: "1 Main St",
      city: "Paris",
    });
    // clearCart() empties the cart, so the page switches to its empty state.
    expect(await screen.findByText("Your cart is empty.")).toBeInTheDocument();
    await waitFor(() => expect(push).toHaveBeenCalledWith("/profile"), {
      timeout: 2000,
    });
  });

  it("shows the server error and keeps the cart", async () => {
    auth.user = { id: "1", name: "Alice", email: "a@b.com" };
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Invalid order items" }),
    });
    setup();
    await userEvent.type(await screen.findByPlaceholderText("Alice"), "Alice");
    await userEvent.type(screen.getByPlaceholderText("Phone number"), "123");
    await userEvent.type(screen.getByPlaceholderText("Street address"), "x");
    await userEvent.type(screen.getByPlaceholderText("City"), "y");
    await userEvent.click(screen.getByRole("button", { name: "Place order" }));
    expect(await screen.findByText("Invalid order items")).toBeInTheDocument();
    expect(screen.getAllByText("Pizza").length).toBeGreaterThan(0);
  });
});
