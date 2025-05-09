import { auth } from "@/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

//new assign karne ke liye 
export const POST = auth(async function POST(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    const { assetId, empId, assignedDate } = await req.json();
    console.log("asset id", assetId);
    console.log("assigned date", assignedDate);
    console.log("emp id", empId);
    try {
        const result = await pool.query(
            `INSERT INTO public.assigned_assets (asset_id,emp_id,assigned_date,assigned_by)VALUES($1,$2,$3,$4) RETURNING *`,
            [assetId, empId, assignedDate, req.auth.user?.id]);
        return NextResponse.json({ Employee: result.rows[0] }, { status: 201 });

    } catch (err) {
        console.error('Error Assigning asset:', err);
        return NextResponse.json({ error: 'Failed to assign asset ' }, { status: 500 });
    }
})



// how will a person identify which data to be retrived
// jis asset ko retrve karna h usko id aur jisko diye h uska id dono chhaiye

// export const PATCH = auth(async function PATCH(req, { params }) {
//     const { assetId, empId, retriveDate, reason } = await params;
//     const { id } = await params;
//     if (!req.auth) {
//         return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
//     }
//     if (!retriveDate || !reason || !assetId || !empId) {
//         return NextResponse.json({ error: 'INSUFFICIENT DATA' }, { status: 400 });
//     }
//     try {
//         const result = await pool.query(
//             `UPDATE public.assigned_assets 
//              SET 
//              retrive_date= $1,
//              retrive_reason = $2,
//              retrive_by =$3     
//              WHERE id = $4,
//              RETURNING *`,
//             [retriveDate, reason, req.auth.user?.id, id]
//         );
//         return NextResponse.json({ Employee: result.rows[0] }, { status: 200 });

//     } catch (err) {
//         console.error('Error retriving the asset:', err);
//         return NextResponse.json({ error: 'Failed to retrive the asset' }, { status: 500 });
//     }
// })

