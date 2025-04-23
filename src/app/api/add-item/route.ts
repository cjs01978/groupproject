// app/api/add-item/route.ts
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, imageUrl, date } = body;

    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    const result = await db.collection('calendarItems').insertOne({
      title,
      description: description || '',
      imageUrl: imageUrl || '',
      date,
      createdAt: new Date().toISOString()
    });

    await client.close();

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
