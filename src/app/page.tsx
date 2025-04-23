
import DateBar from '../components/DateBar';
import ActivityList from '../components/ActivityList';
import WeatherPreview from '../components/WeatherPreview';
import connectMongoDB from '../../config/mongodb';
import { auth } from '../../auth';
import Link from 'next/link';

export default async function Home() {
  connectMongoDB();
  const session = await auth();

  return (
    <main className="min-h-screen p-6">
      {/* Add a navigation section at the top */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daily View</h1>
      </div>
      
      <DateBar />
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2">
          <ActivityList />
        </div>
        <WeatherPreview />
      </div>
    </main>
  );
}
