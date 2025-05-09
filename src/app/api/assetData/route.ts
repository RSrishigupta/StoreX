// export const GET = auth(async function GET(req) {
//     if (!req.auth) {
//         return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
//     }
//     const asset = await pool.query(`
//         SELECT * FROM assets `,);
//     return NextResponse.json({ employees: asset.rows });
// })


import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  insertAsset,
  insertLaptop,
  insertMonitor,
  insertHardDrive,
  insertPendrive,
  insertSim,
  insertMobile,
  insertAccessories
} from "@/lib/DBLayer";
import pool from "@/lib/db";

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const {
    brand, purchaseDate, warrantyDate, ownedBy, type, model, serialNo,
    series, ram, operatingSystem, screenResolution, storage,
    phone, simNo, osType, imei1, imei2, accesoriesType, capacity, remark
  } = body;

  if (!brand || !type || !purchaseDate || !warrantyDate || !ownedBy) {
    return NextResponse.json({ error: "INSUFFICIENT DATA" }, { status: 400 });
  }

  try {
    const asset = await insertAsset({
      brand, model, serialNo, type, purchaseDate, warrantyDate,
      ownedBy, createdBy: req.auth.user?.id
    });

    const assetId = asset.asset_type_id;

    switch (type) {
      case "laptop":
        await insertLaptop(assetId, { series, ram, operatingSystem, screenResolution, storage });
        break;
      case "monitor":
        await insertMonitor(assetId, screenResolution);
        break;
      case "harddrive":
        await insertHardDrive(assetId, storage);
        break;
      case "pendrive":
        await insertPendrive(assetId, storage);
        break;
      case "sim":
        await insertSim(assetId, { phone, simNo });
        break;
      case "mobile":
        await insertMobile(assetId, { osType, imei1, imei2, ram });
        break;
      case "accessories":
        await insertAccessories(assetId, { accesoriesType, capacity, remark });
        break;
    }

    return NextResponse.json({ AssetData: asset }, { status: 201 });
  } catch (err) {
    console.error("Error adding assetdata:", err);
    return NextResponse.json({ error: "failed to add asset" }, { status: 500 });
  }
});

export async function GET() {
  try {
    const types = ["laptop", "mobile", "sim", "monitor", "pendrive", "harddrive", "accessories"];

    const queries = await Promise.all(types.map(async (type) => {
      const { rows } = await pool.query(`
        SELECT a.*, '${type}' AS type, t.*
        FROM assets a
        JOIN ${type} t ON a.asset_type_id = t.id
      `);
      return rows;
    }));
    const assets = queries.flat();
    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 });
  }
}