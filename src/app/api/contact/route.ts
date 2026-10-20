import { NextResponse } from "next/server";

const TO = "abt3ch@gmail.com";
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (clean(body.company, 200)) {
    return NextResponse.json({ ok: true });
  }

  const email = clean(body.email, 320);
  const subject = clean(body.subject, MAX_SUBJECT).replace(/[\r\n]+/g, " ");
  const message = clean(body.message, MAX_MESSAGE);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }
  if (!subject) {
    return NextResponse.json({ ok: false, error: "Enter a subject." }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ ok: false, error: "Enter a message." }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(`https://formsubmit.co/ajax/${TO}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: "https://maaidni.com",
        Referer: "https://maaidni.com/contact",
      },
      body: JSON.stringify({
        email,
        subject,
        message,
        _replyto: email,
        _subject: `Portfolio contact: ${subject}`,
        _template: "table",
        _captcha: "false",
      }),
      signal: AbortSignal.timeout(25000),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "The message could not be sent. Try again in a moment." },
      { status: 502 },
    );
  }

  const result = (await response.json().catch(() => null)) as { success?: string; message?: string } | null;
  if (!response.ok || result?.success !== "true") {
    const activating = /activation/i.test(result?.message ?? "");
    return NextResponse.json(
      {
        ok: false,
        error: activating
          ? "The contact form still needs a one-time confirmation in abt3ch@gmail.com."
          : "The message could not be sent. Try again in a moment.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
