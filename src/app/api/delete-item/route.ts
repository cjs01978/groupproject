import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { CalendarItem } from '../../../types/calendar';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    
    const result = await db.collection<CalendarItem>('calendarItems')
      .deleteOne({ 
        _id: typeof id === 'string' ? new ObjectId(id) : id 
      });
    
    await client.close();

    return NextResponse.json({
      success: result.deletedCount === 1
    });

  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}