import { NextResponse } from 'next/server';
import pool from '@/lib/db'
import { auth } from '@/auth';
export const POST = auth(async function POST(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    const { email, name, phone, type, status } = await req.json();
    if (!email || !name || !phone || !type || !status) {
        return NextResponse.json({ error: 'INSUFFICIENT DATA' }, { status: 400 });
    }
    try {
        const employeeExist = await pool.query(
            `SELECT count(*)>0 exist FROM employee WHERE email = $1 AND archived_at IS NULL`,
            [email]
        );
        if (employeeExist.rows[0].exist) {
            return NextResponse.json({ error: 'EMAIL ALREADY EXISTS' }, { status: 400 });
        }
        const result = await pool.query(
            `INSERT INTO public.employee (name, email, phone, type, status,created_by)VALUES($1,$2,$3,$4,$5,$6)
             RETURNING *`,
            [name, email, phone, type, status, req.auth.user?.id]
        );

        return NextResponse.json({ employee: result.rows[0] }, { status: 201 });

    } catch (err) {
        console.error('Error adding admin:', err);
        return NextResponse.json({ error: 'Failed to add admin user' }, { status: 500 });
    }
})

// export const GET = auth(async function GET(req) {
//     if (!req.auth) {
//         return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
//     }
//     const Employee = await pool.query(`SELECT * FROM EMPLOYEE`,);
//     return NextResponse.json({ employees: Employee.rows });
// })
export const GET = auth(async function GET(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    try {
        // Query to fetch all employee data along with their assigned assets
        const { rows } = await pool.query(`
        SELECT 
          e.*,  -- This will fetch all fields from the employee table
          aa.id AS assigned_asset_id, 
          aa.asset_id, 
          aa.assigned_date,
          aa.retrive_date,
          aa.retrive_reason,
          a.type AS asset_type,
          a.brand,
          a.model,
          a.serial_no,
          a.purchase_date AS asset_purchase_date,
          a.warranty_expire_date AS asset_warranty_expiry,
          a.owned_by AS asset_owner,
          a.archive_reason AS asset_archive_reason
        FROM employee e
        LEFT JOIN assigned_assets aa ON e.id = aa.emp_id
        LEFT JOIN assets a ON aa.asset_id = a.asset_type_id
      `);

        // Formatting the data to camelCase and structuring the result
        const formattedData = rows.map(row => ({
            id: row.id,  // Employee ID from e.*
            name: row.name,
            email: row.email,
            phone: row.phone,
            type: row.type,
            status: row.status,
            createdBy: row.created_by,
            createAt: row.create_at,
            updatedBy: row.updated_by,
            updatedAt: row.updated_at,
            archivedBy: row.archived_by,
            archivedAt: row.archived_at,
            archiveReason: row.archive_reason,

            // Asset data
            assignedAsset: row.assigned_asset_id
                ? {
                    assignedAssetId: row.assigned_asset_id,
                    assetId: row.asset_id,
                    assignedDate: row.assigned_date,
                    retriveDate: row.retrive_date,
                    retriveReason: row.retrive_reason,
                    type: row.asset_type,
                    brand: row.brand,
                    model: row.model,
                    serialNo: row.serial_no,
                    purchaseDate: row.asset_purchase_date,
                    warrantyExpiry: row.asset_warranty_expiry,
                    owner: row.asset_owner,
                    archiveReason: row.asset_archive_reason
                }
                : null  // If no asset assigned, set it to null
        }));

        return NextResponse.json({ employees: formattedData });
    } catch (error) {
        console.error("Error fetching employee data with assets:", error);
        return NextResponse.json({ error: "Failed to fetch employee data" }, { status: 500 });
    }
}
)