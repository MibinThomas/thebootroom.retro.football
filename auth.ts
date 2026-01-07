import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" }, // credentials works with JWT sessions :contentReference[oaicite:3]{index=3}
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          // role is important for admin-only checks
          return { id: "admin", name: "Admin", email, role: "admin" } as any;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role || "admin";
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role;
      return session;
    },
    // Optional extra hardening
    async authorized({ auth }) {
      return !!auth;
    },
  },
  secret: process.env.AUTH_SECRET, // v5 prefers AUTH_SECRET (still fine to also set NEXTAUTH_SECRET)
});
