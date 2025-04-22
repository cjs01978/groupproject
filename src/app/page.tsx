'use client';
import Header from '../components/Header';
import DateBar from '../components/DateBar';
import ActivityList from '../components/ActivityList';
import WeatherPreview from '../components/WeatherPreview';
import { useEffect, useState } from 'react';
import connectMongoDB from '../../config/mongodb';


export default function Home() {
  connectMongoDB();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // this section is so that the login/logout button is consistant
  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  return (
    <main className="min-h-screen p-6">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
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
