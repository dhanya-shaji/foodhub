import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContactPage from "./page";

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

async function fillForm() {
  await userEvent.type(screen.getByPlaceholderText("Your full name"), "Bob");
  await userEvent.type(screen.getByPlaceholderText("your@email.com"), "bob@x.com");
  await userEvent.type(
    screen.getByPlaceholderText("Tell us how we can help you..."),
    "Where is my order?"
  );
}

describe("Contact page", () => {
  it("submits the form and shows the success message", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Thank you! Your message has been saved." }),
    });
    render(<ContactPage />);
    await fillForm();
    await userEvent.click(screen.getByRole("button", { name: "Send Message" }));

    expect(await screen.findByText(/Your message has been saved/)).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toMatchObject({
      name: "Bob",
      email: "bob@x.com",
      message: "Where is my order?",
    });
    // form resets after success
    expect(screen.getByPlaceholderText("Your full name")).toHaveValue("");
  });

  it("shows the server error message", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Please enter a valid email address" }),
    });
    render(<ContactPage />);
    await fillForm();
    await userEvent.click(screen.getByRole("button", { name: "Send Message" }));
    expect(
      await screen.findByText("Please enter a valid email address")
    ).toBeInTheDocument();
  });

  it("shows a friendly message when the network fails", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));
    render(<ContactPage />);
    await fillForm();
    await userEvent.click(screen.getByRole("button", { name: "Send Message" }));
    await waitFor(() =>
      expect(screen.getByText(/Unable to reach the server/)).toBeInTheDocument()
    );
  });
});
