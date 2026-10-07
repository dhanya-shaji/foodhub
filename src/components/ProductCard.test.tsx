import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ProductCard from "./ProductCard";
import { StoreProvider, useStore } from "@/context/StoreContext";

const product = {
  id: 1,
  name: "Margherita Pizza",
  price: 8.99,
  imageUrl: "https://images.unsplash.com/x.jpg",
  category: "Pizza",
};

function Harness() {
  const { cartCount, wishlist } = useStore();
  return (
    <>
      <ProductCard product={product} />
      <output data-testid="cart">{cartCount}</output>
      <output data-testid="wish">{wishlist.length}</output>
    </>
  );
}

const setup = () =>
  render(
    <StoreProvider>
      <Harness />
    </StoreProvider>
  );

describe("ProductCard", () => {
  it("shows name, category, euro price and image", () => {
    setup();
    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.getByText("€8.99")).toBeInTheDocument();
    expect(screen.getByAltText("Margherita Pizza")).toBeInTheDocument();
  });

  it("adds to the cart", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    await userEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    expect(screen.getByTestId("cart")).toHaveTextContent("2");
  });

  it("toggles the wishlist and updates its label", async () => {
    setup();
    await userEvent.click(screen.getByLabelText("Add to wishlist"));
    expect(screen.getByTestId("wish")).toHaveTextContent("1");
    expect(screen.getByLabelText("Remove from wishlist")).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Remove from wishlist"));
    expect(screen.getByTestId("wish")).toHaveTextContent("0");
  });
});
