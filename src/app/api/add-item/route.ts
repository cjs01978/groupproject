import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { CalendarItem } from '../../../types/calendar';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

export async function POST(req: Request) {
  try {
    const { title, description, imageUrl, date } = await req.json();
    
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    
    const newItem: Omit<CalendarItem, '_id'> = {
      title,
      description: description || '',
      imageUrl: imageUrl || '',
      date,
      createdAt: new Date()
    };

    const result = await db.collection('calendarItems').insertOne(newItem);
    await client.close();

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add item' },
      { status: 500 }
    );
  }
}