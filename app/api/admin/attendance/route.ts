import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();

  // Must be logged in AND admin
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") || "";
  let teamId = "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    teamId = params.get("teamId") || "";
  } else {
    const body = await req.json().catch(() => ({}));
    teamId = body.teamId || "";
  }

  if (!teamId) {
    return NextResponse.json({ error: "teamId required" }, { status: 400 });
  }

  await prisma.team.update({
    where: { id: teamId },
    data: { attendance: true },
  });

  return NextResponse.redirect(new URL(`/admin/scan/${teamId}?ok=1`, req.url));
}
