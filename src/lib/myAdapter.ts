import {Adapter, AdapterUser} from "@auth/core/adapters";
import { Pool } from "pg";
export default function MyAdapter(pool: Pool): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      const result = await pool.query(
        `INSERT INTO users (name, email, "email_verified", image)
          VALUES ($1, $2, $3, $4)
          RETURNING *`,
        [user.name, user.email, user.emailVerified, user.image]
      );
      
      return result.rows[0];
    },

    async getUser(id) {
      console.log("getuser")
      const res = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
      return res.rows[0] || null;
    },

    async getUserByEmail(email) {
      console.log("getUserByEmail")
      const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
      return res.rows[0] || null;
    },

    async getUserByAccount({ providerAccountId, provider }) {
      console.log("getUserByAccount")
      const res = await pool.query(
        `SELECT u.* FROM accounts a JOIN users u ON a.user_id = u.id
         WHERE a.provider = $1 AND a.provider_account_id = $2`,
        [provider, providerAccountId]
      );
      return res.rows[0] || null;
    },

    async updateUser(user) {
      console.log("updateUser");
      
      if (!user.email) {
        throw new Error("Email is required to update user");
      }
    
      const result = await pool.query(
        `UPDATE users SET name = $1, email = $2, email_verified = $3, image = $4 WHERE id = $5 RETURNING *`,
        [user.name, user.email, user.emailVerified, user.image, user.id]
      );
    
      const updatedUser = result.rows[0];
    
      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email, 
        emailVerified: updatedUser.email_verified,
        image: updatedUser.image,
      };
    },
    

    async deleteUser(userId) {
      console.log("deleteUser")
      await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
    },

    async linkAccount(account) {
      console.log("linkAccount")
      await pool.query(
        `INSERT INTO accounts ( user_id, type, provider, provider_account_id, access_token, refresh_token, expires_at, token_type, scope, id_token, session_state)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.access_token,
          account.refresh_token,
          account.expires_at,
          account.token_type,
          account.scope,
          account.id_token,
          account.session_state
        ]
      );
    },

    async unlinkAccount({ providerAccountId, provider }) {
      console.log("unlinkAccount")
      await pool.query(
        `DELETE FROM accounts WHERE provider = $1 AND provider_account_id = $2`,
        [provider, providerAccountId]
      );
    },

    async createSession({ sessionToken, userId, expires }) {
      console.log("createSession")
      await pool.query(
        `INSERT INTO sessions ( user_id, session_token, expires)
         VALUES ($1, $2, $3)`,
        [userId, sessionToken, expires]
      );
      return { sessionToken, userId, expires };
    },

    async getSessionAndUser(sessionToken) {
      // console.log("getSessionAndUser")
      const res = await pool.query(
        `SELECT s.session_token, s.expires as expires, u.*
         FROM sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.session_token = $1`,
        [sessionToken]
      );
      if (!res.rows.length) return null;
      const session = {
        sessionToken: res.rows[0].session_token,
        userId: res.rows[0].id,
        expires: res.rows[0].expires,
      };
      const user = {
        id: res.rows[0].id,
        name: res.rows[0].name,
        email: res.rows[0].email,
        emailVerified: res.rows[0].email_verified,
        image: res.rows[0].image,
      };
      return { session, user };
    },

    async updateSession({ sessionToken, expires, userId }: { sessionToken: string, expires: Date, userId: string }) {
      await pool.query(
        `UPDATE sessions SET expires = $1, user_id = $2 WHERE session_token = $3`,
        [expires, userId, sessionToken]
      );
      return { sessionToken, expires, userId };
    },
    

    async deleteSession(sessionToken) {
      console.log("deleteSession")
      await pool.query(`DELETE FROM sessions WHERE session_token = $1`, [sessionToken]);
    },

    async createVerificationToken({ identifier, expires, token }) {
      console.log("createVerificationToken")
      await pool.query(
        `INSERT INTO verification_token (identifier, token, expires)
         VALUES ($1, $2, $3)`,
        [identifier, token, expires]
      );
      return { identifier, token, expires };
    },

    async useVerificationToken({ identifier, token }) {
      console.log("useVerificationToken")
      const res = await pool.query(
        `DELETE FROM verification_token
         WHERE identifier = $1 AND token = $2
         RETURNING *`,
        [identifier, token]
      );
      return res.rows[0] || null;
    }
  };
}
