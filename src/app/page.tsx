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

  const today = format(new Date(), 'yyyy-MM-dd');

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
    <main className="min-h-screen p-6 flex flex-col items-center justify-between">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold text-[#BA0C2F]">Today's Activities</h1>
        </div>

        <DateBar />
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="col-span-2">
            <ActivityList items={items} />
          </div>
          <WeatherPreview />
        </div>
      </div>

      {/* Animated UGA Motto Image */}
      <div className="mt-12">
        <img
          src="https://appstickers-cdn.appadvice.com/1152789134/837690206/998686d53fa8ee3b4006c9a6bb41f93c-6.png"
          alt="Attack the Day"
          className="h-50 w-auto animate-pulse"
        />
      </div>
    </main>
  );
}
