import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/models/Contact";

const ALLOWED_SUBJECTS = [
  "general",
  "order",
  "feedback",
  "partnership",
  "other",
] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const subject = String(body.subject ?? "general").trim().toLowerCase();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (message.length < 5) {
      return NextResponse.json(
        { error: "Message must be at least 5 characters" },
        { status: 400 }
      );
    }

    const normalizedSubject = ALLOWED_SUBJECTS.includes(
      subject as (typeof ALLOWED_SUBJECTS)[number]
    )
      ? subject
      : "general";

    await connectDB();

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject: normalizedSubject,
      message,
      status: "new",
    });

    return NextResponse.json(
      {
        message: "Thank you! Your message has been saved.",
        contact: {
          id: String(contact._id),
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          subject: contact.subject,
          message: contact.message,
          createdAt: contact.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Unable to save your message. Please try again." },
      { status: 500 }
    );
  }
}
