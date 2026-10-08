import { NextRequest, NextResponse } from "next/server";

const METRICS = ["LCP", "INP", "CLS", "FCP", "TTFB"] as const;
const RATINGS = ["good", "needs-improvement", "poor"] as const;

/**
 * Receives Web Vitals from the browser and logs them as structured JSON.
 * Swap the console.info for a database write or analytics call to keep history.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "");
    const value = Number(body?.value);
    const rating = String(body?.rating ?? "");

    if (
      !METRICS.includes(name as (typeof METRICS)[number]) ||
      !Number.isFinite(value) ||
      !RATINGS.includes(rating as (typeof RATINGS)[number])
    ) {
      return NextResponse.json({ error: "Invalid metric" }, { status: 400 });
    }

    console.info(
      JSON.stringify({
        type: "web-vital",
        name,
        value: Math.round(value * 1000) / 1000,
        rating,
        path: String(body?.path ?? "").slice(0, 200),
      })
    );
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
