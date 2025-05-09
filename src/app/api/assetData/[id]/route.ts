import { auth } from "@/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

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
             UPDATE public.assets 
                SET archived_at = now(),
 	            archived_by=$1,
                archive_reason = $2
                WHERE asset_type_id = $3 RETURNING *
            `, [req.auth.user?.id, reason, id])
        return NextResponse.json({ message: 'ASSETS archived successfully' });
    } catch (err) {
        console.log('Error while archiving the data: ', err)
        return NextResponse.json({ error: 'Failed to archive the ASSET' }, { status: 500 }
        )
    }

})
// get request bana h particular id ke hisab se

export const GET = auth(async function GET(req, { params }) {
    const { id } = await params;
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    const type = await pool.query(`SELECT type  FROM assets WHERE asset_type_id = $1`, [id]);
    console.log(type.rows[0].type);
    const asset_type = type.rows[0].type;
    const asset = await pool.query(`
        SELECT *  FROM ${asset_type} as x join assets as a on x.id = a.asset_type_id 
        WHERE x.id=$1`, [id]);
    return NextResponse.json({ ASSET: asset.rows });
})



//patch request bana h particular id ke hisab se 
export const PATCH = auth(async function PATCH(req, { params }) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
    const { id } = await params;

    const {
        brand, purchaseDate, warrantyDate, ownedBy, type, model, serialNo, series, ram, operatingSystem, screenResolution, storage,
        phone, simNo, osType, imei1, imei2, accesoriesType, capacity, remark
    } = await req.json();

    if (!brand || !type || !purchaseDate || !warrantyDate || !ownedBy) {
        return NextResponse.json({ error: 'INSUFFICIENT DATA' }, { status: 400 });
    }

    try {
        // patch for themain data

        // type nikal kar rakh lena h phir patch marnege 

        const { rows } = await pool.query(`SELECT type FROM assets WHERE asset_type_id = $1`, [id]);
        const originalType = rows[0]?.type;

        console.log("original type", originalType);
        console.log("new type", type);
        console.log("---------------->", originalType === type);


        const result = await pool.query(`
                UPDATE public.assets 
                SET brand = $1,
                model = $2,
                serial_no = $3,
                type = $4,
                purchase_date = $5,
                warranty_expire_date = $6,
                owned_by = $7,
                updated_by = $8,
                updated_at = NOW()
                WHERE asset_type_id = $9
                RETURNING *;
                `, [brand, model, serialNo, type, purchaseDate, warrantyDate, ownedBy, req.auth.user?.id, id]);

        //agr  type change kar  rahe h to previous table se  delelte ho jana  chahiye  aur new table me data add ho jana chahiye

        //  check kar liye type change h to delete kar diye record kko
        if (originalType == type) {


            if (type === 'laptop') {
                await pool.query(`
                UPDATE public.laptop
                SET series = $1, 
                ram = $2, 
                operating_system = $3, 
                screen_resolution = $4, 
                storage = $5
                WHERE id = $6
                `, [series, ram, operatingSystem, screenResolution, storage, id]);
            } else if (type === 'monitor') {
                await pool.query(`
                UPDATE public.monitor
                SET screen_resolution = $1
                WHERE id = $2
                `, [screenResolution, id]);
            } else if (type === 'harddrive') {
                await pool.query(`
                UPDATE public.harddrive
                SET storage = $1
                WHERE id = $2
                `, [storage, id]);
            } else if (type === 'sim') {
                await pool.query(`
                UPDATE public.sim
                SET phone = $1, sim_no = $2
                WHERE id = $3
                `, [phone, simNo, id]);
            } else if (type === 'pendrive') {
                await pool.query(`
                UPDATE public.pendrive
                SET storage = $1
                WHERE id = $2
                `, [storage, id]);
            } else if (type === 'mobile') {
                await pool.query(`
                UPDATE public.mobile
                SET os_type = $1, imei_1 = $2, imei_2 = $3, ram = $4
                WHERE id = $5
                `, [osType, imei1, imei2, ram, id]);
            } else if (type === 'accessories') {
                await pool.query(`
                UPDATE public.accessories
                SET accessories_type = $1, capacity = $2, remark = $3
                WHERE id = $4
                `, [accesoriesType, capacity, remark, id]);
            }
        }
        else {
            //pahle delte kar dena h uske baad insert karna h data taable ke andar
            await pool.query(`DELETE FROM ${originalType} where id =$1`, [id])

            if (type === 'laptop') {
                await pool.query(`INSERT INTO public.laptop (id,series,ram,operating_system,screen_resolution,storage) VALUES ($1,$2,$3,$4,$5,$6)`, [id, series, ram, operatingSystem, screenResolution, storage])
            }
            //monitor ok
            else if (type === 'monitor') {
                await pool.query(`INSERT INTO public.monitor (id,screen_resolution) VALUES ($1,$2)`, [id, screenResolution])
            }
            //  ok working now
            else if (type === 'harddrive') {
                await pool.query(`INSERT INTO public.harddrive (id,storage) VALUES ($1,$2)`, [id, storage])
            }
            // sim ok 
            else if (type === 'sim') {
                await pool.query(`INSERT INTO public.sim (id,phone,sim_no) VALUES ($1,$2,$3)`, [id, phone, simNo])
            }
            // pendirve ok
            else if (type === 'pendrive') {
                await pool.query(`INSERT INTO public.pendrive (id,storage) VALUES ($1,$2)`, [id, storage])
            }
            // mobile ok
            else if (type === 'mobile') {
                await pool.query(`INSERT INTO public.mobile (id,os_type,imei_1,imei_2,ram) VALUES ($1,$2,$3,$4,$5)`, [id, osType, imei1, imei2, ram])
            }
            // accessories ok
            else if (type === 'accessories') {
                await pool.query(`INSERT INTO public.accessories (id,accessories_type,capacity,remark) VALUES ($1,$2,$3,$4)`, [id, accesoriesType, capacity, remark])
            }
        }
        return NextResponse.json({ AssetData: result.rows[0] }, { status: 200 });

    } catch (err) {
        console.error('Error updating asset data:', err);
        return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
    }
});
