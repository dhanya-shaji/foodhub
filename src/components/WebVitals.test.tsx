import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

let reporter: (metric: Record<string, unknown>) => void;
vi.mock("next/web-vitals", () => ({
  useReportWebVitals: (cb: typeof reporter) => {
    reporter = cb;
  },
}));

import WebVitals from "./WebVitals";

const metric = { id: "v1-1", name: "LCP", value: 1800, rating: "good", extra: "x" };

beforeEach(() => {
  Object.defineProperty(navigator, "sendBeacon", {
    value: vi.fn().mockReturnValue(true),
    configurable: true,
  });
});

describe("WebVitals", () => {
  it("renders nothing", () => {
    const { container } = render(<WebVitals />);
    expect(container).toBeEmptyDOMElement();
  });

  it("beacons only the needed fields plus the path", () => {
    render(<WebVitals />);
    reporter(metric);
    const [url, body] = (navigator.sendBeacon as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("/api/vitals");
    expect(JSON.parse(body)).toEqual({
      id: "v1-1",
      name: "LCP",
      value: 1800,
      rating: "good",
      path: "/",
    });
  });

  it("falls back to fetch with keepalive when sendBeacon fails", () => {
    (navigator.sendBeacon as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const fetchMock = vi.fn().mockResolvedValue({});
    vi.stubGlobal("fetch", fetchMock);
    render(<WebVitals />);
    reporter(metric);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/vitals",
      expect.objectContaining({ method: "POST", keepalive: true })
    );
  });
});
