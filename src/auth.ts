// auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import MyAdapter from "@/lib/myAdapter"; // Import your custom adapter
import pool from "@/lib/db";
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MyAdapter(pool),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      const email = user.email;
      if (!email) return false;
      const { rows } = await pool.query(
        `SELECT * FROM admin WHERE email = $1 AND archived_at IS NULL`,
        [email]
      );
      return rows.length > 0;
    },
  },
  session: {
    strategy: "database",
  },
});
