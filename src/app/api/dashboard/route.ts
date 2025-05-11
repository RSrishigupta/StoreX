import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@/auth';
export const GET = auth(async function GET(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    // console.log(req.auth.user);
    try {
        const url = new URL(req.url);
        const status = url.searchParams.get('status');
        let query = `
            SELECT type, COUNT(*) AS count
            FROM assets
        `;
        if (status) {
            query += ` WHERE status = $1`;
        }
        query += ` GROUP BY type`;
        const result = await pool.query(query, status ? [status] : []);
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
        let total = 0;

        for (const type of allTypes) {
            const count = counts[type] || 0;
            formattedCounts[type] = count;
            total += count;
        }

        // console.log('Formatted Counts:', formattedCounts);


        return NextResponse.json({ Total: total, AssetData: formattedCounts });
    } catch (error) {
        console.error('Error fetching asset counts:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
)