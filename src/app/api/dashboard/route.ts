import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@/auth';

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status'); // "available", "assign", or "total"

    // Get the main filtered asset data
    let query = `
      SELECT type, COUNT(*) AS count
      FROM assets
    `;
    const values: string[] = [];

    if (status === 'Available' || status === 'Assign') {
      query += ` WHERE status = $1`;
      values.push(status);
    }

    query += ` GROUP BY type`;

    const result = await pool.query(query, values);

    const counts = result.rows.reduce((acc, row) => {
      acc[row.type] = parseInt(row.count, 10);
      return acc;
    }, {} as Record<string, number>);

    const allTypes = [
      'laptop',
      'mobile',
      'sim',
      'monitor',
      'pendrive',
      'harddrive',
      'mouse',
      'accessories'
    ];

    const formattedCounts: Record<string, number> = {};
    for (const type of allTypes) {
      const count = counts[type] || 0;
      formattedCounts[type] = count;
    }

    // Get assigned and available totals
    const assignedResult = await pool.query(
      `SELECT COUNT(*) FROM assets WHERE status = 'Assign'`
    );
    const availableResult = await pool.query(
      `SELECT COUNT(*) FROM assets WHERE status = 'Available'`
    );

    const TotalAssigned = parseInt(assignedResult.rows[0].count, 10);
    const TotalAvailable = parseInt(availableResult.rows[0].count, 10);
    const Total = TotalAssigned + TotalAvailable;

    return NextResponse.json({
      Total,
      TotalAssigned,
      TotalAvailable,
      AssetData: formattedCounts
    });

  } catch (error) {
    console.error('Error fetching asset counts:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
});
