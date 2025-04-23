// app/api/edit-item/route.ts
import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

export async function PUT(req: Request) {
  try {
    const { id, title, description, imageUrl } = await req.json();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid item ID' }, { status: 400 });
    }

    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    const result = await db.collection('calendarItems').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, description, imageUrl } }
    );

    await client.close();

    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, error: 'Item not updated' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}
