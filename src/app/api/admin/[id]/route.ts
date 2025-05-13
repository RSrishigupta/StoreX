import { auth } from "@/auth";
import { archiveAdmin } from "@/lib/DBLayer";
import { NextResponse } from "next/server";

export const DELETE = auth(async function DELETE(req, { params }) {
    const {id} = await params;

    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    try {
        const user = await archiveAdmin(id, req.auth.user?.id);
        return NextResponse.json({ user }, { status: 200 });
    } catch (err) {
        console.error('Error deleting admin:', err);
        return NextResponse.json({ error: 'Failed to delete admin user' }, { status: 500 });
    }
})
// haar page me check lagana  hoga session ka param