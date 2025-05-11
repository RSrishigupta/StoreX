
// how will a person identify which data to be retrived
// jis asset ko retrve karna h usko id aur jisko diye h uska id dono chhaiye

import { auth } from "@/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = auth(async function PATCH(req, { params }) {
    const { retriveDate, reason } = await req.json();
    const { id } = await params;
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    if (!retriveDate || !reason) {
        return NextResponse.json({ error: 'INSUFFICIENT DATA' }, { status: 400 });
    }

    try {
        console.log("retrive date", retriveDate);
        console.log("reason", reason);
        console.log("id", id);
        await pool.query(
            `UPDATE public.assets SET status = 'available' 
                WHERE asset_type_id = (select asset_id from assigned_assets where id = $1)`, [id]);
        const result = await pool.query(
            `UPDATE PUBLIC.ASSIGNED_ASSETS
                SET
                    RETRIVE_DATE = $1,
                    RETRIVE_REASON = $2,
                    RETRIVE_BY = $3+
                WHERE
                    ID = $4
                RETURNING *`,
            [retriveDate, reason, req.auth.user?.id, id]
        );
        return NextResponse.json({ Employee: result.rows[0] }, { status: 200 });

    } catch (err) {
        console.error('Error retriving the asset:', err);
        return NextResponse.json({ error: 'Failed to retrive the asset' }, { status: 500 });
    }
})

