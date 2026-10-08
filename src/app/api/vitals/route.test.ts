// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const req = (body: unknown, raw?: string) =>
  new NextRequest("http://localhost/api/vitals", {
    method: "POST",
    body: raw ?? JSON.stringify(body),
  });

let info: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  info = vi.spyOn(console, "info").mockImplementation(() => {});
});

describe("POST /api/vitals", () => {
  it.each(["LCP", "INP", "CLS", "FCP", "TTFB"])("accepts %s", async (name) => {
    const res = await POST(req({ name, value: 123.4567, rating: "good", path: "/" }));
    expect(res.status).toBe(204);
    expect(JSON.parse(info.mock.calls[0][0] as string)).toMatchObject({
      type: "web-vital",
      name,
      rating: "good",
      path: "/",
    });
  });

  it("rejects unknown metric names", async () => {
    const res = await POST(req({ name: "FID", value: 1, rating: "good" }));
    expect(res.status).toBe(400);
    expect(info).not.toHaveBeenCalled();
  });

  it("rejects non-numeric values and bad ratings", async () => {
    expect((await POST(req({ name: "LCP", value: "x", rating: "good" }))).status).toBe(400);
    expect((await POST(req({ name: "LCP", value: 1, rating: "great" }))).status).toBe(400);
  });

  it("rejects invalid JSON", async () => {
    expect((await POST(req(null, "not json"))).status).toBe(400);
  });

  it("truncates very long paths", async () => {
    await POST(req({ name: "CLS", value: 0.1, rating: "good", path: "/" + "a".repeat(500) }));
    expect(JSON.parse(info.mock.calls[0][0] as string).path.length).toBe(200);
  });
});
