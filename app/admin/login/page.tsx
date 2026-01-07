"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    // ✅ redirect:true => don't use return value
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/admin",
      redirect: true,
    });

    // If credentials are wrong, NextAuth will redirect back with ?error=CredentialsSignin
    // You can read that from searchParams on the page (optional).
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
