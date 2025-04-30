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

export async function createAdmin(email: string, created_by: string) {
  const result = await pool.query(
    'INSERT INTO admin (email, created_by) VALUES ($1, $2) RETURNING *',
    [email, created_by]
  );
  return result.rows[0];
}

export async function archiveAdmin(id: string, admin_id: string) {
  const result = await pool.query(
    'UPDATE admin SET archived_at = now(), archived_by = $1 WHERE id = $2 RETURNING *',
    [admin_id, id]
  );
  return result.rows;
}
