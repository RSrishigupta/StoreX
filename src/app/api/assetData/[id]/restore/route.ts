import { auth } from "@/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = auth(async function PATCH(req, { params }) {
    const { id } = await params;
    if (!req.auth) {
        return NextResponse.json({ message: "NOT authenticated" }, { status: 401 })
    }
    console.log(req.auth);
    
    try {
        console.log("Try catch entered");
        console.log("id is this ",id);
        
        await pool.query(` 
             UPDATE public.assets 
                SET archived_at = NULL,
 	            archived_by=NULL,
                archive_reason = NULL,
                status = 'Available'
                WHERE asset_type_id = $1 
				RETURNING *
            `, [id])
        return NextResponse.json({ message: 'ASSET RESOTRE SUCCESFULL' });
    } catch (err) {
        console.log('Error while restoring the ASSER: ', err)
        return NextResponse.json({ error: 'FAILED TO RESTORE THE ASSET' }, { status: 500 }
        )
    }

})