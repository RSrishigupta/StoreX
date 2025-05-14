import { auth } from "@/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

//new assign karne ke liye 
export const POST = auth(async function POST(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    const { assetId, empId, assignedDate } = await req.json();
    if (!assetId || !empId || !assignedDate) {
        return NextResponse.json({ error: 'INSUFFICIENT DATA' }, { status: 400 });
    }
    console.log("asset id", assetId);
    console.log("assigned date", assignedDate);
    console.log("emp id", empId);
    try {
        //pahle se assigned to nhi hai asset
        const checkAssigned = await pool.query(
            `select count(*)> 0 as exist from assets where asset_type_id = $1 and status = 'Assign'`, [assetId])
        if (checkAssigned.rows[0].exist) {
            return NextResponse.json({ error: 'Asset is already assigned' }, { status: 400 });
        }
        //assigned hone ke baad asset ki status change ho jani chahiye
        await pool.query(
            `UPDATE public.assets SET status = 'Assign' WHERE asset_type_id = $1`, [assetId]);

        const result = await pool.query(
            `INSERT INTO public.assigned_assets 
                (asset_id,emp_id,assigned_date,assigned_by)
                 VALUES($1,$2,$3,$4) 
                    RETURNING *`,
            [assetId, empId, assignedDate, req.auth.user?.id]);
        return NextResponse.json({ Employee: result.rows[0] }, { status: 201 });

    } catch (err) {
        console.error('Error Assigning asset:', err);
        return NextResponse.json({ error: 'Failed to assign asset ' }, { status: 500 });
    }
})


