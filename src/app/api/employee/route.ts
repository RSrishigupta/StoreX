import { NextResponse } from 'next/server';
import pool from '@/lib/db'
import { auth } from '@/auth';
export const POST = auth(async function POST(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    const { email, name, phone, type, status} = await req.json();
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

        return NextResponse.json({ note: result.rows[0] }, { status: 201 });

    } catch (err) {
        console.error('Error adding admin:', err);
        return NextResponse.json({ error: 'Failed to add admin user' }, { status: 500 });
    }
})

export const GET = auth(async function GET(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    const Employee = await pool.query(`SELECT * FROM EMPLOYEE`,);
    return NextResponse.json({ employees: Employee.rows });
})
