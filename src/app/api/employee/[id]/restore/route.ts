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
        
        await pool.query(` 
             UPDATE public.employee 
                SET archived_at = NULL,
 	            archived_by=NULL,
                archive_reason = NULL
                WHERE id = $1 
				RETURNING *
            `, [id])
        return NextResponse.json({ message: 'EMPLOYEE RESOTRE SUCCESFULL' });
    } catch (err) {
        console.log('Error while restoring the Employee: ', err)
        return NextResponse.json({ error: 'FAILED TO RESTORE THE EMPLOYEE' }, { status: 500 }
        )
    }

})