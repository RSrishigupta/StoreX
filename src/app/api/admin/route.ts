// app/api/admin/route.ts
import { NextResponse } from 'next/server';
import { auth } from "@/auth"
import {findAdminByEmail, createAdmin } from '@/lib/DBLayer';
import { getAdmins } from '@/lib/DBLayer';

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }
  const users = await getAdmins();
  return NextResponse.json({ users });
})


export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }
  const { email} = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'EMAIL REQUIRED' }, { status: 400 });
  }
  try {
    const exists = await findAdminByEmail(email);
    if (exists) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    const user = await createAdmin(email, req.auth.user?.id);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error('Error adding admin:', err);
    return NextResponse.json({ error: 'Failed to add admin user' }, { status: 500 });
  }
})