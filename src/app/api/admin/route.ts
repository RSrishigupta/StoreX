import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM admin WHERE archived_at IS NULL ORDER BY created_by');
    return NextResponse.json({ ADMIN: result.rows });
  } catch (err) {
    console.error('Error fetching admin:', err);
    return NextResponse.json(
      { error: 'Failed to fetch admin' },
      { status: 500 }
    );
  }
}
///////////////////////POST USER/////////////////////////
export async function POST(req: Request) {
  const { email,created_by } = await req.json();
  if (!email||!created_by) {
    return NextResponse.json(
      { error: 'EMAIL REQUIRED' },
      { status: 400 }
    );
  }
  try {
    const existing = await pool.query(
      'SELECT count(*) > 0 AS exists FROM admin WHERE email= $1',
      [email]
    );
    if (existing.rows[0].exists) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    const result = await pool.query(
      'INSERT INTO admin (email,created_by) VALUES ($1,$2) RETURNING *',
      [email,created_by]
    );
    return NextResponse.json(
      { user: result.rows[0] },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error adding admin:', err);
    return NextResponse.json(
      { error: 'Failed to add admin user' },
      { status: 500 }
    );
  }
}
/////////////////////DELETE USER/////////////////////////
export async function DELETE(req: Request) {
  const { id,admin_id } = await req.json();
  if(id===admin_id){
    return NextResponse.json(
      { error: 'Connot Delete Yourself' },
      { status: 403 }
    );
  }
  if (!id||!admin_id) {
    return NextResponse.json(
      { error: 'Provide an ID ' },
      { status: 400 }
    );
  }
  try {
    const result = await pool.query(
      'UPDATE admin SET archived_at = now() ,archived_by = $1 WHERE ID = $2 RETURNING *',
      [admin_id,id]
    );
    return NextResponse.json(
      { user: result.rows},
      { status: 200 }
    );
  } catch (err) {
    console.error('Error deleting admin:', err);
    return NextResponse.json(
      { error: 'Failed to delete admin user' },
      { status: 500 }
    );
  }
}
