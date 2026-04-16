import { NextResponse } from "next/server";
import { setAdminCookie, signAdminToken } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: "Admin auth is not configured (missing ADMIN_EMAIL/ADMIN_PASSWORD)." },
      { status: 501 },
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = await signAdminToken({ email });
  await setAdminCookie(token);

  return NextResponse.json({ ok: true });
}
