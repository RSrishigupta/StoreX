// lib/DBLayer.ts
import pool from '@/lib/db';

//
// ─── ADMIN SECTION ─────────────────────────────────────────────────────────────
//

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

export async function createAdmin(email: string, created_by: string | undefined) {
  const result = await pool.query(
    'INSERT INTO admin (email, created_by) VALUES ($1, $2) RETURNING *',
    [email, created_by]
  );
  return result.rows[0];
}

export async function archiveAdmin(id: string, admin_id: string | undefined) {
  const result = await pool.query(
    `UPDATE admin SET archived_at = now(), archived_by = $1 WHERE id = $2;
     DELETE FROM sessions
     USING admin a
     JOIN users u ON a.email = u.email
     WHERE a.archived_at IS NOT NULL AND u.id = sessions."userId";`,
    [admin_id, id]
  );
  return result.rows;
}

//
// ─── ASSET SECTION ─────────────────────────────────────────────────────────────
//

export async function insertAsset(data: {
  brand: string;
  model: string;
  serialNo: string;
  type: string;
  status?: string;
  purchaseDate: string;
  warrantyDate: string;
  ownedBy: string;
  createdBy: string|undefined;
}) {
  const {
    brand, model, serialNo, type, status = "available",
    purchaseDate, warrantyDate, ownedBy, createdBy
  } = data;

  const result = await pool.query(
    `INSERT INTO public.assets (brand, model, serial_no, type, status, purchase_date, warranty_expire_date, owned_by, created_by, create_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *;`,
    [brand, model, serialNo, type, status, purchaseDate, warrantyDate, ownedBy, createdBy]
  );

  return result.rows[0];
}

export async function insertLaptop(assetId: string, data: {
  series: string;
  ram: string;
  operatingSystem: string;
  screenResolution: string;
  storage: string;
}) {
  const { series, ram, operatingSystem, screenResolution, storage } = data;
  await pool.query(
    `INSERT INTO public.laptop (id, series, ram, operating_system, screen_resolution, storage)
     VALUES ($1, $2, $3, $4, $5, $6);`,
    [assetId, series, ram, operatingSystem, screenResolution, storage]
  );
}

export async function insertMonitor(assetId: string, screenResolution: string) {
  await pool.query(
    `INSERT INTO public.monitor (id, screen_resolution) VALUES ($1, $2);`,
    [assetId, screenResolution]
  );
}

export async function insertHardDrive(assetId: string, storage: string) {
  await pool.query(
    `INSERT INTO public.harddrive (id, storage) VALUES ($1, $2);`,
    [assetId, storage]
  );
}

export async function insertPendrive(assetId: string, storage: string) {
  await pool.query(
    `INSERT INTO public.pendrive (id, storage) VALUES ($1, $2);`,
    [assetId, storage]
  );
}

export async function insertSim(assetId: string, data: { phone: string; simNo: string }) {
  await pool.query(
    `INSERT INTO public.sim (id, phone, sim_no) VALUES ($1, $2, $3);`,
    [assetId, data.phone, data.simNo]
  );
}

export async function insertMobile(assetId: string, data: {
  osType: string;
  imei1: string;
  imei2: string;
  ram: string;
}) {
  await pool.query(
    `INSERT INTO public.mobile (id, os_type, imei_1, imei_2, ram) VALUES ($1, $2, $3, $4, $5);`,
    [assetId, data.osType, data.imei1, data.imei2, data.ram]
  );
}

export async function insertAccessories(assetId: string, data: {
  accesoriesType: string;
  capacity: string;
  remark: string;
}) {
  await pool.query(
    `INSERT INTO public.accessories (id, accessories_type, capacity, remark) VALUES ($1, $2, $3, $4);`,
    [assetId, data.accesoriesType, data.capacity, data.remark]
  );
}
