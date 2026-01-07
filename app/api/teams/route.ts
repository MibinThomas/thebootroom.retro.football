export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { generateTicketPdf } from "@/lib/pdf";

type PlayerCreate = {
  name: string;
  jerseyNumber: string;
  jerseySize: string;
  preferredPosition: string;
};

async function uploadToBlob(file: File | null, folder: string) {
  if (!file || file.size === 0) return null;

  const cleanName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "");
  const key = `${folder}/${crypto.randomUUID()}-${cleanName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploaded = await put(key, buffer, {
    access: "public",
    contentType: file.type || "application/octet-stream",
  });

  return uploaded.url; // public URL
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const teamName = formData.get("teamName")?.toString() || "";
    const companyName = formData.get("companyName")?.toString() || "";
    const companySector = formData.get("companySector")?.toString() || "";
    const companyAddress = formData.get("companyAddress")?.toString() || "";
    const managerName = formData.get("managerName")?.toString() || "";
    const managerEmail = formData.get("managerEmail")?.toString() || "";
    const managerPhone = formData.get("managerPhone")?.toString() || "";
    const captainName = formData.get("captainName")?.toString() || "";
    const captainEmail = formData.get("captainEmail")?.toString() || "";
    const captainPhone = formData.get("captainPhone")?.toString() || "";

    // players (10)
    const players: PlayerCreate[] = [];
    for (let i = 0; i < 10; i++) {
      const name = formData.get(`players[${i}][name]`)?.toString() || "";
      const jerseyNumber =
        formData.get(`players[${i}][jerseyNumber]`)?.toString() || "";
      const jerseySize =
        formData.get(`players[${i}][jerseySize]`)?.toString() || "";
      const preferredPosition =
        formData.get(`players[${i}][preferredPosition]`)?.toString() || "";

      players.push({ name, jerseyNumber, jerseySize, preferredPosition });
    }

    const logoFile = formData.get("logo") as File | null;
    const guidelinesFile = formData.get("guidelines") as File | null;

    // ✅ Upload files to Vercel Blob
    const logoUrl = await uploadToBlob(logoFile, "uploads");
    const brandGuidelinesUrl = await uploadToBlob(guidelinesFile, "uploads");

    // ✅ Create team
    const team = await prisma.team.create({
      data: {
        teamName,
        companyName,
        companySector,
        companyAddress,
        managerName,
        managerEmail,
        managerPhone,
        captainName,
        captainEmail,
        captainPhone,
        logoUrl: logoUrl ?? undefined,
        brandGuidelinesUrl: brandGuidelinesUrl ?? undefined,
        players: { create: players },
      },
      include: { players: true },
    });

    // ✅ Generate ticket PDF (Buffer)
    const pdfBuffer = await generateTicketPdf(team);

    // ✅ Upload ticket PDF to Vercel Blob
    const ticketKey = `tickets/${team.id}.pdf`;
    const ticketUpload = await put(ticketKey, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
    });

    // ✅ Save ticket URL
    await prisma.team.update({
      where: { id: team.id },
      data: { ticketPdfUrl: ticketUpload.url },
    });

    return NextResponse.json({ success: true, teamId: team.id });
  } catch (error: any) {
    console.error("Create team error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create team" },
      { status: 500 }
    );
  }
}
