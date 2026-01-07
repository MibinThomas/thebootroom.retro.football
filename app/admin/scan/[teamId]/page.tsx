import { prisma } from "@/lib/prisma";

export default async function AdminScanPage({
  params,
  searchParams,
}: {
  params: { teamId: string };
  searchParams: { ok?: string };
}) {
  const team = await prisma.team.findUnique({
    where: { id: params.teamId },
    include: { players: true },
  });

  if (!team) return <div style={{ padding: 20 }}>Team not found.</div>;

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Attendance Verification</h1>

      {searchParams.ok === "1" && (
        <p style={{ color: "green", marginTop: 10 }}>
          ✅ Attendance marked successfully
        </p>
      )}

      <p style={{ marginTop: 10 }}>
        <b>Team:</b> {team.teamName} <br />
        <b>Company:</b> {team.companyName} <br />
        <b>Team ID:</b> {team.id}
      </p>

      <form action="/api/admin/attendance" method="POST">
        <input type="hidden" name="teamId" value={team.id} />
        <button
          style={{
            marginTop: 14,
            padding: "12px 16px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Mark Attendance ✅
        </button>
      </form>
    </div>
  );
}
