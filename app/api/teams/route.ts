export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { generateTicketPdf } from "@/lib/pdf";

function cleanFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9_.-]/g, "");
}

async function uploadToBlob(file: File, folder: "uploads" | "tickets") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeName = cleanFileName(file.name || "file");
  const key = `${folder}/${crypto.randomUUID()}-${safeName}`;

  const blob = await put(key, buffer, {
    access: "public",
    contentType: file.type || "application/octet-stream",
  });

  return blob.url; // public https url
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const teamName = formData.get("teamName")?.toString() || "";
    // const companyName = formData.get("companyName")?.toString() || "";
    // const companySector = formData.get("companySector")?.toString() || "";
    // const companyAddress = formData.get("companyAddress")?.toString() || "";
    // const managerName = formData.get("managerName")?.toString() || "";
    // const managerEmail = formData.get("managerEmail")?.toString() || "";
    // const managerPhone = formData.get("managerPhone")?.toString() || "";
    const captainName = formData.get("captainName")?.toString() || "";
    const captainEmail = formData.get("captainEmail")?.toString() || "";
    const captainPhone = formData.get("captainPhone")?.toString() || "";

    // Collect players (10)
    const players: {
      name: string;
      jerseyNumber: string;
      jerseySize: string;
      preferredPosition: string;
    }[] = [];

    for (let i = 0; i < 10; i++) {
  const name = formData.get(`players[${i}][name]`)?.toString() || "";
  const jerseyNumber =
    formData.get(`players[${i}][jerseyNumber]`)?.toString() || "";
  const jerseySize =
    formData.get(`players[${i}][jerseySize]`)?.toString() || "";
  const preferredPosition =
    formData.get(`players[${i}][preferredPosition]`)?.toString() || "";

  // only push if fully filled
  if (name && jerseyNumber && jerseySize && preferredPosition) {
    players.push({ name, jerseyNumber, jerseySize, preferredPosition });
  }
}

if (players.length < 7) {
  return NextResponse.json(
    { error: "Minimum 7 players are required" },
    { status: 400 }
  );
}

    // Upload optional files to Blob
    const logoFile = formData.get("logo") as File | null;
    const guidelinesFile = formData.get("guidelines") as File | null;

    const logoUrl = logoFile ? await uploadToBlob(logoFile, "uploads") : null;
    const brandGuideUrl = guidelinesFile
      ? await uploadToBlob(guidelinesFile, "uploads")
      : null;

    // Create team in DB
    const team = await prisma.team.create({
      data: {
        teamName,
        // companyName,
        // companySector,
        // companyAddress,
        // managerName,
        // managerEmail,
        // managerPhone,
        captainName,
        captainEmail,
        captainPhone,
        logoUrl: logoUrl ?? undefined,
        brandGuideUrl: brandGuideUrl ?? undefined,
        players: { create: players },
      },
      include: { players: true },
    });

    // Generate ticket PDF (buffer) and upload to Blob
    const pdfBuffer = await generateTicketPdf(team);
    const ticketBlob = await put(`tickets/${team.id}.pdf`, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
    });

    await prisma.team.update({
      where: { id: team.id },
      data: { ticketPdfUrl: ticketBlob.url },
    });

    return NextResponse.json({
      success: true,
      teamId: team.id,
      ticketPdfUrl: ticketBlob.url,
      message:"Registration successful!"
    });
  } catch (error) {
    console.error("POST /api/teams error:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
