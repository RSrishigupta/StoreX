import { auth } from "@/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

//new assign karne ke liye 
export const POST = auth(async function POST(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    const { assetId,sendDate,reason} = await req.json();

    if (!assetId || !sendDate || !reason) {
        return NextResponse.json({ error: 'INSUFFICIENT DATA' }, { status: 400 });
    }
    
    try {
        //pahle se assigned to nhi hai asset
        const checkAssigned = await pool.query(
            `select count(*)> 0 as exist from assets where asset_type_id = $1 and status = 'assign'`, [assetId])
        if (checkAssigned.rows[0].exist) {
            return NextResponse.json({ error: 'Asset is already assigned' }, { status: 400 });
        }
        //servive me jane ke baad asset ki status change ho jani chahiye
        await pool.query(
            `UPDATE public.assets SET status = 'service' WHERE asset_type_id = $1`, [assetId]);

        const result = await pool.query(
            `INSERT INTO public.service (asset_id, sent_by, sent_date, reason)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [assetId, req.auth.user?.id, sendDate, reason]);
        return NextResponse.json({ Service: result.rows[0] }, { status: 201 });

    } catch (err) {
        console.error('Error sending to service:', err);
        return NextResponse.json({ error: 'Failed to sent to  service ' }, { status: 500 });
    }
})


