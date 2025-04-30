// app/api/admin/route.ts
import { NextResponse } from 'next/server';
import { getAdmins, findAdminByEmail, createAdmin, archiveAdmin } from '@/lib/DBLayer';

export async function GET() {
  try {
    const ADMIN = await getAdmins();
    return NextResponse.json({ ADMIN });
  } catch (err) {
    console.error('Error fetching admin:', err);
    return NextResponse.json(
      { error: 'Failed to fetch admin' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { email, created_by } = await req.json();

  if (!email || !created_by) {
    return NextResponse.json({ error: 'EMAIL REQUIRED' }, { status: 400 });
  }

  try {
    const exists = await findAdminByEmail(email);

    if (exists) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const user = await createAdmin(email, created_by);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error('Error adding admin:', err);
    return NextResponse.json({ error: 'Failed to add admin user' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { id, admin_id } = await req.json();

  if (id === admin_id) {
    return NextResponse.json({ error: 'Cannot Delete' }, { status: 403 });
  }

  if (!id || !admin_id) {
    return NextResponse.json({ error: 'Provide an ID' }, { status: 400 });
  }

  try {
    const user = await archiveAdmin(id, admin_id);
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error('Error deleting admin:', err);
    return NextResponse.json({ error: 'Failed to delete admin user' }, { status: 500 });
  }
}
