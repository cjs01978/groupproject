import DateBar from '../components/DateBar';
import ActivityList from '../components/ActivityList';
import WeatherPreview from '../components/WeatherPreview';
import connectMongoDB from '../../config/mongodb';
import { MongoClient } from 'mongodb';
import { auth } from '../../auth';
import { CalendarItem } from '../types/calendar';
import { format } from 'date-fns';

export default async function Home() {
  await connectMongoDB();
  const session = await auth();

  const today = format(new Date(), 'yyyy-MM-dd'); // e.g., "2025-04-22"

  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB!);

  const rawItems = await db.collection('calendarItems')
    .find({ date: today })
    .sort({ createdAt: -1 })
    .toArray();

  const items: CalendarItem[] = rawItems.map((item: any) => ({
    _id: item._id.toString(),
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl,
    date: item.date,
  }));

  await client.close();

  return (
    <main className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Today's Activities</h1>
      </div>

      <DateBar />
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2">
          <ActivityList items={items} />
        </div>
        <WeatherPreview />
      </div>
    </main>
  );
}
