import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { StoreProvider, useStore } from "./StoreContext";

const wrapper = ({ children }: { children: ReactNode }) => (
  <StoreProvider>{children}</StoreProvider>
);

const pizza = { id: 1, name: "Pizza", price: 10, imageUrl: "u", category: "Pizza" };
const sushi = { id: 2, name: "Sushi", price: 5.5, imageUrl: "u", category: "Sushi" };

describe("StoreContext cart", () => {
  it("adds products and increments quantity for duplicates", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => result.current.addToCart(pizza));
    act(() => result.current.addToCart(pizza, 2));
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(3);
    expect(result.current.cartCount).toBe(3);
  });

  it("computes the total", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => result.current.addToCart(pizza, 2));
    act(() => result.current.addToCart(sushi));
    expect(result.current.cartTotal).toBeCloseTo(25.5);
  });

  it("updates quantity and removes the item at zero", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => result.current.addToCart(pizza));
    act(() => result.current.updateQuantity(1, 4));
    expect(result.current.cart[0].quantity).toBe(4);
    act(() => result.current.updateQuantity(1, 0));
    expect(result.current.cart).toEqual([]);
  });

  it("removes and clears", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => result.current.addToCart(pizza));
    act(() => result.current.addToCart(sushi));
    act(() => result.current.removeFromCart(1));
    expect(result.current.cart.map((i) => i.id)).toEqual([2]);
    act(() => result.current.clearCart());
    expect(result.current.cart).toEqual([]);
  });

  it("persists to localStorage and restores on mount", () => {
    const first = renderHook(() => useStore(), { wrapper });
    act(() => first.result.current.addToCart(pizza, 2));
    expect(JSON.parse(localStorage.getItem("foodhub_cart")!)[0].quantity).toBe(2);
    first.unmount();

    const second = renderHook(() => useStore(), { wrapper });
    expect(second.result.current.cartCount).toBe(2);
  });

  it("ignores corrupt localStorage data", () => {
    localStorage.setItem("foodhub_cart", "{not json");
    const { result } = renderHook(() => useStore(), { wrapper });
    expect(result.current.cart).toEqual([]);
  });
});

describe("StoreContext wishlist", () => {
  it("toggles items on and off", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => result.current.toggleWishlist(pizza));
    expect(result.current.isInWishlist(1)).toBe(true);
    act(() => result.current.toggleWishlist(pizza));
    expect(result.current.isInWishlist(1)).toBe(false);
  });

  it("removes a specific item and persists", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => result.current.toggleWishlist(pizza));
    act(() => result.current.toggleWishlist(sushi));
    act(() => result.current.removeFromWishlist(1));
    expect(result.current.wishlist.map((p) => p.id)).toEqual([2]);
    expect(JSON.parse(localStorage.getItem("foodhub_wishlist")!)).toHaveLength(1);
  });
});

describe("useStore", () => {
  it("throws outside the provider", () => {
    expect(() => renderHook(() => useStore())).toThrow(/StoreProvider/);
  });
});
