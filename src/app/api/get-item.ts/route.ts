import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { CalendarItem } from '../../../types/calendar';


const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) {
      return NextResponse.json(
        { success: false, error: 'Month and year are required' },
        { status: 400 }
      );
    }

    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    const items = await db.collection<CalendarItem>('calendarItems')
      .find({
        date: {
          $regex: `^${year}-${month.padStart(2, '0')}`
        }
      })
      .sort({ date: 1 })
      .toArray();

    await client.close();

    return NextResponse.json({ success: true, items });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}