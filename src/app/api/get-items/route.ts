// app/api/get-items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

export async function GET(req: NextRequest) {
  const client = new MongoClient(uri);
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) {
      return NextResponse.json({ success: false, error: 'Missing month/year' }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const items = await db.collection('calendarItems').find({
      date: { $regex: `^${year}-${month.padStart(2, '0')}` }
    }).toArray();

    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch items' }, { status: 500 });
  } finally {
    await client.close();
  }
}
