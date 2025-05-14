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
    phone, simNo, osType, imei1, imei2, accessoriesType, capacity, remark
  } = body;
  console.log("data in the route.ts file", accessoriesType, capacity, remark);
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
        await insertAccessories(assetId, { accessoriesType, capacity, remark });
        break;
      default:
        break;
    }

    return NextResponse.json({ AssetData: asset }, { status: 201 });
  } catch (err) {
    console.error("Error adding assetdata:", err);
    return NextResponse.json({ error: "failed to add asset" }, { status: 500 });
  }
});
export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await pool.query(`
    SELECT
      A.*,
      L.SERIES,
      L.RAM AS LAPTOP_RAM,
      L.STORAGE AS LAPTOP_STORAGE,
      L.OPERATING_SYSTEM AS LAPTOP_OS,
      L.SCREEN_RESOLUTION,
      L.CHARGER,
      P.STORAGE AS PENDRIVE_STORAGE,
      H.STORAGE AS HARDDISK_STORAGE,
      M.SCREEN_RESOLUTION AS MONITOR_RESOLUTION,
      MO.OS_TYPE,
      MO.IMEI_1,
      MO.IMEI_2,
      MO.RAM AS MOBILE_RAM,
      S.SIM_NO,
      S.PHONE,
      ACC.ACCESSORIES_TYPE,
      ACC.REMARK,
      ACC.CAPACITY
    FROM
      ASSETS A
      LEFT JOIN LAPTOP L ON A.ASSET_TYPE_ID = L.ID
      LEFT JOIN PENDRIVE P ON A.ASSET_TYPE_ID = P.ID
      LEFT JOIN HARDDRIVE H ON A.ASSET_TYPE_ID = H.ID
      LEFT JOIN MONITOR M ON A.ASSET_TYPE_ID = M.ID
      LEFT JOIN MOBILE MO ON A.ASSET_TYPE_ID = MO.ID
      LEFT JOIN SIM S ON A.ASSET_TYPE_ID = S.ID
      LEFT JOIN ACCESSORIES ACC ON A.ASSET_TYPE_ID = ACC.ID
      order by A.CREATE_AT DESC

    `);
    // console.log(result.rows);

    const formattedAssets = result.rows.map((row) => {
      const base = {
        id: row.asset_type_id,
        brand: row.brand,
        model: row.model,
        serial_no: row.serial_no,
        type: row.type,
        status: row.status,
        purchase_date: row.purchase_date,
        warranty_expire_date: row.warranty_expire_date,
        created_by: row.created_by,
        archived_by: row.archived_by,
        archive_reason: row.archive_reason,
        create_at: row.create_at,
        updated_at: row.updated_at,
        archived_at: row.archived_at,
        owned_by: row.owned_by,
      };

      let specs = null;

      switch (row.type) {
        case 'laptop':
          specs = {
            series: row.series,
            processor: row.processor,
            ram: row.laptop_ram,
            storage: row.laptop_storage,
            os: row.laptop_os,
            screen_resolution: row.screen_resolution,
            charger: row.charger,
          };
          break;
        case 'pendrive':
          specs = { storage: row.pendrive_storage };
          break;
        case 'harddrive':
          specs = { storage: row.harddisk_storage };
          break;
        case 'monitor':
          specs = { screen_resolution: row.monitor_resolution };
          break;
        case 'mobile':
          specs = {
            os_type: row.os_type,
            imei_1: row.imei_1,
            imei_2: row.imei_2,
            ram: row.mobile_ram,
          };
          break;
        case 'sim':
          specs = {
            sim_no: row.sim_no,
            phone_no: row.phone_no,
          };
          break;
        case 'accessories':
          specs = {
            acc_type: row.acc_type,
            remark: row.remark,
            capacity: row.capacity,
          };
          break;
      }

      return { ...base, specifications: specs };
    });
    return NextResponse.json({ assets: formattedAssets }, { status: 200 });

    // return NextResponse.json({ assets: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
});