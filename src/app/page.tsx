
import DateBar from '../components/DateBar';
import ActivityList from '../components/ActivityList';
import WeatherPreview from '../components/WeatherPreview';
import connectMongoDB from '../../config/mongodb';
import { auth } from '../../auth';


export default async function Home() {
  connectMongoDB();
  const session = await auth();

  return (
    <main className="min-h-screen p-6">
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
