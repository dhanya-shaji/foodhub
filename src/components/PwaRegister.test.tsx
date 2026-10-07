import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PwaRegister from "./PwaRegister";

function installPrompt(outcome: "accepted" | "dismissed" = "accepted") {
  return Object.assign(new Event("beforeinstallprompt", { cancelable: true }), {
    prompt: vi.fn().mockResolvedValue(undefined),
    userChoice: Promise.resolve({ outcome }),
  });
}

describe("PwaRegister install button", () => {
  it("is hidden until the browser offers installation", () => {
    render(<PwaRegister />);
    expect(screen.queryByText("Install FoodHub")).not.toBeInTheDocument();
  });

  it("appears on beforeinstallprompt and suppresses the default prompt", () => {
    render(<PwaRegister />);
    const evt = installPrompt();
    act(() => {
      window.dispatchEvent(evt);
    });
    expect(evt.defaultPrevented).toBe(true);
    expect(screen.getByText("Install FoodHub")).toBeInTheDocument();
  });

  it("calls prompt() on click and hides afterwards", async () => {
    render(<PwaRegister />);
    const evt = installPrompt();
    act(() => {
      window.dispatchEvent(evt);
    });
    await userEvent.click(screen.getByText("Install FoodHub"));
    expect(evt.prompt).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Install FoodHub")).not.toBeInTheDocument();
  });

  it("hides on appinstalled", () => {
    render(<PwaRegister />);
    act(() => {
      window.dispatchEvent(installPrompt());
    });
    act(() => {
      window.dispatchEvent(new Event("appinstalled"));
    });
    expect(screen.queryByText("Install FoodHub")).not.toBeInTheDocument();
  });
});

describe("PwaRegister service worker registration", () => {
  const register = vi.fn().mockResolvedValue({});

  beforeEach(() => {
    register.mockClear();
    Object.defineProperty(navigator, "serviceWorker", {
      value: { register },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    // @ts-expect-error cleanup of the test stub
    delete navigator.serviceWorker;
  });

  it("registers /sw.js in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    render(<PwaRegister />);
    expect(register).toHaveBeenCalledWith("/sw.js");
  });

  it("does not register outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    render(<PwaRegister />);
    expect(register).not.toHaveBeenCalled();
  });
});
