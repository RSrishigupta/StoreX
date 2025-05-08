import { auth } from "@/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
export const POST = auth(async function POST(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    const { brand, purchaseDate, warrantyDate, ownedBy, type, model, serialNo, series, ram, operatingSystem, screenResolution, storage,
        phone, simNo, osType, imei1, imei2, accesoriesType, capacity, remark
    } = await req.json();
    if (!brand || !type || !purchaseDate || !warrantyDate || !ownedBy) {
        return NextResponse.json({ error: 'INSUFFICIENT DATA' }, { status: 400 });
    }
    try {
        const result = await pool.query(`INSERT INTO public.assets (brand, model, serial_no,type, status,purchase_date,warranty_expire_date,owned_by,created_by,create_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *;`, [brand, model, serialNo, type, 'available', purchaseDate, warrantyDate, ownedBy, req.auth.user?.id]);

        const asset_id = result.rows[0].asset_type_id;
        //laptop ok
        if (type === 'laptop') {
            await pool.query(`INSERT INTO public.laptop (id,series,ram,operating_system,screen_resolution,storage) VALUES ($1,$2,$3,$4,$5,$6)`, [asset_id, series, ram, operatingSystem, screenResolution, storage])
        }
        //monitor ok
        else if (type === 'monitor') {
            await pool.query(`INSERT INTO public.monitor (id,screen_resolution) VALUES ($1,$2)`, [asset_id, screenResolution])
        }
        //  ok working now
        else if (type === 'harddrive') {
            await pool.query(`INSERT INTO public.harddrive (id,storage) VALUES ($1,$2)`, [asset_id, storage])
        }
        // sim ok 
        else if (type === 'sim') {
            await pool.query(`INSERT INTO public.sim (id,phone,sim_no) VALUES ($1,$2,$3)`, [asset_id, phone, simNo])
        }
        // pendirve ok
        else if (type === 'pendrive') {
            await pool.query(`INSERT INTO public.pendrive (id,storage) VALUES ($1,$2)`, [asset_id, storage])
        }
        // mobile ok
        else if (type === 'mobile') {
            await pool.query(`INSERT INTO public.mobile (id,os_type,imei_1,imei_2,ram) VALUES ($1,$2,$3,$4,$5)`, [asset_id, osType, imei1, imei2, ram])
        }
        // accessories ok
        else if (type === 'accessories') {
            await pool.query(`INSERT INTO public.accessories (id,type,capacity,remark) VALUES ($1,$2,$3,$4)`, [asset_id, accesoriesType, capacity, remark])
        }
        console.log(result.rows[0].asset_type_id);
        return NextResponse.json({ AssetData: result.rows[0] }, { status: 201 });
    } catch (err) {
        console.error('Error adding assetdata:', err);
        return NextResponse.json({ error: 'failed to add asset' }, { status: 500 });
    }
})