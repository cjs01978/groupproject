'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MonthlyPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('January'); // initial month
  const year = 2025; // set year

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // days of month methods
  const getDaysInMonth = (month: string, year: number) => {
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    return new Date(year, monthIndex + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (month: string, year: number) => {
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    return new Date(year, monthIndex, 1).getDay();
  };
  const daysInMonth = getDaysInMonth(selectedMonth, year);
  const firstDayOfMonth = getFirstDayOfMonth(selectedMonth, year);
  const totalDays = firstDayOfMonth + daysInMonth;
  const rows = Math.ceil(totalDays / 7); 



  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleReturnHome = () => {
    router.push('/');
  };

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      router.push('/login');
    }
  };


  
  return (
    <div className="min-h-screen bg-white p-6 flex flex-col overflow-auto">
      {/* Header row */}
      <div className="grid grid-cols-3 items-center mb-4 gap-4">
        <div className="bg-gray-100 p-3 rounded shadow justify-self-start">
          {/* title of page */}
          <h1 className="text-2xl font-bold">Monthly Calendar View</h1>
        </div>

        <div className="bg-gray-100 p-3 rounded shadow justify-self-center">
          {/* drop down for months */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border px-3 py-2 rounded w-48 text-center"
          >
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December',
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>


        <div className="bg-gray-100 p-3 rounded shadow justify-self-end">
          <button
            onClick={handleLoginLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>

      {/* editing message only when logged in */}
      {isLoggedIn && (
        <div className="bg-gray-800 p-4 rounded shadow-md mb-6 flex justify-between items-start">
          <div className="text-white font-semibold text-center w-full">
            <div className="text-lg mb-2">Editing Mode</div>
            <p className="text-sm">
              How to use: Click on a day to add activities. Delete or edit with the appropriate icons.
            </p>
          </div>
        </div>
      )}


      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-3 rounded shadow">
          <button
            onClick={handleReturnHome}
            className="bg-blue-500 text-white px-4 py-2 rounded">
            Switch to Daily View
          </button>
        </div>
      </div>

      {/* days of month container */}
      <div className="flex justify-center mb-6 flex-grow">
        <div className="bg-gray-200 p-6 rounded-lg shadow-md w-full relative">
          <div className="bg-white p-6 rounded-lg shadow-lg pt-12">
            {/* tab displaying month, year */}
            <div className="absolute top-0 left-0 transform translate-x-0 translate-y-0 mt-4 ml-4 w-32 text-center bg-gray-200 p-2 rounded-t-md shadow-lg">
              <span className="text-gray-600 font-semibold">{`${selectedMonth}, ${year}`}</span>
            </div>
            {/* days of the week */}
            <div className="grid grid-cols-7 gap-4 mb-2 text-center">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-sm font-semibold text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* days grid */}
            <div className="grid grid-cols-7 gap-4">
              {/* creates empty boxes for days not in month*/}
              {[...Array(firstDayOfMonth)].map((_, index) => (
                <div key={`empty-${index}`} className="bg-gray-400 rounded-lg h-40"></div>
              ))}

              {/* days of month */}
              {[...Array(daysInMonth)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-400 rounded-lg h-40 flex flex-col items-center justify-start relative">
                  <div className="absolute top-2 left-2 text-2xl font-bold text-gray-700">
                    {index + 1}
                  </div>
                  {/* weather image */}
                  <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-15 md:h-15 bg-white rounded-full flex items-center justify-center border border-gray-300 absolute top-4">
                    <p className="text-xs sm:text-sm font-semibold text-gray-600">Weather image</p>
                  </div>
                </div>
              ))}

              {/* empty days following days of month */}
              {[...Array(42 - (firstDayOfMonth + daysInMonth))].map((_, index) => (
                <div key={`empty-after-${index}`} className="bg-gray-400 rounded-lg h-40"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
