import { expect, test, type Page } from "@playwright/test";

// Mock the backend so these flows don't need MongoDB. The service worker is
// blocked so Playwright's route interception sees every request.
test.use({ serviceWorkers: "block" });

const products = [
  { id: 1, name: "Margherita Pizza", price: 8.99, category: "Pizza", imageUrl: "https://images.unsplash.com/a.jpg" },
  { id: 2, name: "Pepperoni Pizza", price: 10.5, category: "Pizza", imageUrl: "https://images.unsplash.com/b.jpg" },
  { id: 4, name: "Cheeseburger", price: 9.25, category: "Burgers", imageUrl: "https://images.unsplash.com/c.jpg" },
];

async function mockBackend(page: Page, user: object | null = null) {
  await page.route("**/api/products", (r) => r.fulfill({ json: { products } }));
  await page.route("**/api/auth/me", (r) =>
    user ? r.fulfill({ json: { user } }) : r.fulfill({ status: 401, json: { user: null } })
  );
  // Don't hit the real image CDN.
  await page.route("**/_next/image**", (r) =>
    r.fulfill({
      contentType: "image/gif",
      body: Buffer.from("R0lGODlhAQABAAAAACwAAAAAAQABAAA=", "base64"),
    })
  );
}

test.describe("Navigation", () => {
  test("home page loads with the navbar", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/");
    await expect(page).toHaveTitle(/FoodHub/);
    await expect(page.getByRole("link", { name: "FoodHub" }).first()).toBeVisible();
  });

  test("navbar links reach about, menu and contact", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/");
    for (const [name, url] of [
      ["About", /\/about$/],
      ["Menu", /\/product$/],
      ["Contact", /\/contact$/],
    ] as const) {
      await page.getByRole("link", { name, exact: true }).first().click();
      await expect(page).toHaveURL(url);
    }
  });

  test("mobile menu opens and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await mockBackend(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-menu").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
  });
});

test.describe("Menu, cart and wishlist", () => {
  test("lists products from the API", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/product");
    await expect(page.getByText("Margherita Pizza")).toBeVisible();
    await expect(page.getByText("Cheeseburger")).toBeVisible();
    await expect(page.getByText("€8.99")).toBeVisible();
  });

  test("adding to cart updates the badge and the cart page, and survives reload", async ({
    page,
  }) => {
    await mockBackend(page);
    await page.goto("/product");
    await page.getByRole("button", { name: "Add to cart" }).first().click();
    await page.getByRole("button", { name: "Add to cart" }).first().click();
    await expect(page.getByRole("link", { name: "Cart" }).first()).toContainText("2");

    await page.goto("/cart");
    await expect(page.getByText("Margherita Pizza").first()).toBeVisible();
    await page.reload();
    await expect(page.getByText("Margherita Pizza").first()).toBeVisible();
  });

  test("wishlist toggle shows on the wishlist page", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/product");
    await page.getByLabel("Add to wishlist").first().click();
    await page.goto("/wishlist");
    await expect(page.getByText("Margherita Pizza").first()).toBeVisible();
  });

  test("guests are asked to sign in at checkout", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/product");
    await page.getByRole("button", { name: "Add to cart" }).first().click();
    await page.goto("/cart");
    await expect(
      page.getByRole("button", { name: "Sign in to checkout" })
    ).toBeDisabled();
  });
});

test.describe("Checkout", () => {
  test("signed-in user places an order", async ({ page }) => {
    await mockBackend(page, { id: "1", name: "Alice", email: "a@b.com" });
    let orderBody: { items: unknown[]; delivery: { city: string } } | undefined;
    await page.route("**/api/orders", async (r) => {
      if (r.request().method() === "POST") {
        orderBody = r.request().postDataJSON();
        return r.fulfill({ status: 201, json: { order: { id: "o1" } } });
      }
      return r.fulfill({ json: { orders: [] } });
    });

    await page.goto("/product");
    await page.getByRole("button", { name: "Add to cart" }).first().click();
    await page.goto("/cart");
    await page.getByLabel("Full name").fill("Alice");
    await page.getByLabel("Phone").fill("123456");
    await page.getByLabel("Address").fill("1 Main St");
    await page.getByLabel("City").fill("Paris");
    await page.getByRole("button", { name: "Place order" }).click();

    await expect(page).toHaveURL(/\/profile$/);
    expect(orderBody?.items).toEqual([{ productId: 1, quantity: 1 }]);
    expect(orderBody?.delivery.city).toBe("Paris");
  });
});

test.describe("Auth", () => {
  test("login success redirects to the profile", async ({ page }) => {
    await mockBackend(page);
    await page.route("**/api/auth/login", (r) =>
      r.fulfill({ json: { user: { id: "1", name: "Alice", email: "a@b.com" } } })
    );
    await page.route("**/api/orders", (r) => r.fulfill({ json: { orders: [] } }));
    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill("a@b.com");
    await page.getByPlaceholder("At least 6 characters").fill("secret1");
    await page.getByRole("button", { name: "Sign In" }).first().click();
    await expect(page).toHaveURL(/\/profile$/);
  });

  test("shows an error for bad credentials", async ({ page }) => {
    await mockBackend(page);
    await page.route("**/api/auth/login", (r) =>
      r.fulfill({ status: 401, json: { error: "Invalid email or password" } })
    );
    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill("a@b.com");
    await page.getByPlaceholder("At least 6 characters").fill("wrong12");
    await page.getByRole("button", { name: "Sign In" }).first().click();
    await expect(page.getByText("Invalid email or password")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("toggles to register mode", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/login");
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page.getByText("Create your account")).toBeVisible();
    await expect(page.getByPlaceholder("Your name")).toBeVisible();
  });
});

test.describe("Contact form", () => {
  test("submits and shows a confirmation", async ({ page }) => {
    await mockBackend(page);
    await page.route("**/api/contact", (r) =>
      r.fulfill({
        status: 201,
        json: { message: "Thank you! Your message has been saved." },
      })
    );
    await page.goto("/contact");
    // Next streams the page; right after load the form can briefly exist twice.
    await page.waitForLoadState("networkidle");
    await page.getByPlaceholder("Your full name").fill("Bob");
    await page.getByPlaceholder("your@email.com").fill("bob@x.com");
    await page.getByPlaceholder("Tell us how we can help you...").fill("Where is my order?");
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText(/Your message has been saved/)).toBeVisible();
  });
});
