import { auth } from "@/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = auth(async function PATCH(req, { params }) {
    const param = await params;
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    const { email, name, phone, type, status } = await req.json();
    if (!email || !name || !phone || !type || !status) {
        return NextResponse.json({ error: 'INSUFFICIENT DATA' }, { status: 400 });
    }
    try {
        const result = await pool.query(
            `UPDATE public.employee 
             SET name = $1, 
             email = $2, 
             phone = $3, 
             type = $4, 
             status = $5, 
             updated_by = $6,
             updated_at= now()           
             WHERE id = $7
             RETURNING *`,
            [name, email, phone, type, status, req.auth.user?.id, param.id]
        );
        return NextResponse.json({ note: result.rows[0] }, { status: 201 });

    } catch (err) {
        console.error('Error adding admin:', err);
        return NextResponse.json({ error: 'Failed to add admin user' }, { status: 500 });
    }
})

export const DELETE = auth(async function DELETE(req, { params }) {
    const { id } = await params;
    if (!req.auth) {
        return NextResponse.json({ message: "NOT authenticated" }, { status: 401 })
    }
    const { reason } = await req.json();
    if (!reason) {
        return NextResponse.json({ error: 'Give reason to archive' }, { status: 400 });
    }
    try {
        await pool.query(` 
             UPDATE public.employee 
                SET archived_at = now(),
 	            archived_by=$1,
                archive_reason = $2
                WHERE id = $3 RETURNING *
            `, [req.auth.user?.id, reason, id])
        return NextResponse.json({ message: 'Employee archived successfully' });
    } catch (err) {
        console.log('Error while archiving the data: ', err)
        return NextResponse.json({ error: 'Failed to archive the employee' }, { status: 500 }
        )
    }

})

export const GET = auth(async function GET(req,{params}) {
    const {id} = await params;
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    const Employee = await pool.query(`SELECT * FROM EMPLOYEE WHERE id = $1`,[id]);
    return NextResponse.json({ employees: Employee.rows[0] });
})
