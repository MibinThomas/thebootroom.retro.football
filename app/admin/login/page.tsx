"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (errorParam) setErr("Invalid admin credentials");
  }, [errorParam]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    // ✅ No "res" variable at all => no TypeScript error possible
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl,
    });
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Admin Login</h1>

      <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          style={{ width: "100%", padding: 10, marginTop: 6 }}
        />

        <label style={{ display: "block", marginTop: 12 }}>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          style={{ width: "100%", padding: 10, marginTop: 6 }}
        />

        {err && <p style={{ color: "red", marginTop: 10 }}>{err}</p>}

        <button
          type="submit"
          style={{
            marginTop: 14,
            width: "100%",
            padding: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
