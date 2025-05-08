// lib/DBLayer.ts
import pool from '@/lib/db';

export async function getAdmins() {
  const result = await pool.query(
    'SELECT * FROM admin WHERE archived_at IS NULL ORDER BY created_by'
  );
  return result.rows;
}

export async function findAdminByEmail(email: string) {
  const result = await pool.query(
    'SELECT count(*) > 0 AS exists FROM admin WHERE email = $1',
    [email]
  );
  return result.rows[0].exists;
}

export async function createAdmin(email: string, created_by: string|undefined) {
  const result = await pool.query(
    'INSERT INTO admin (email, created_by) VALUES ($1, $2) RETURNING *',
    [email, created_by]
  );
  return result.rows[0];
}

export async function archiveAdmin(id: string, admin_id: string|undefined) {
  const result = await pool.query(
    //agar admin ki id aur user ki id same kar de to itna wuery nhi likhna pareag ek query me hi sare table ke kaam ho jaege
    'UPDATE admin SET archived_at = now(), archived_by = $1 WHERE id = $2;            DELETE FROM sessions USING admin a JOIN users u ON a.email = u.email WHERE a.archived_at IS NOT NULL AND u.id = sessions."userId";',
    [admin_id, id]
  );
  return result.rows;
}