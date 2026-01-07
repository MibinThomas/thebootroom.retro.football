import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // your auth options

export default async function AdminScanPage({ params }: { params: { teamId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div>
      <h1>Verify Attendance</h1>
      <p>Team ID: {params.teamId}</p>
      {/* call an API to mark attendance */}
    </div>
  );
}
