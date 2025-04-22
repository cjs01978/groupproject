'use client';
import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import AddItem from './AddItem';
import { CalendarItem } from '../types/calendar';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch items for the current month
  const fetchItems = async () => {
    try {
      const month = format(currentMonth, 'MM');
      const year = format(currentMonth, 'yyyy');
      const res = await fetch(`/api/get-items?month=${month}&year=${year}`);
      const data = await res.json();
      if (data.success) setItems(data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Handle month navigation
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Handle date selection
  const handleDateClick = (day: Date) => {
    if (!isLoggedIn) return;
    setSelectedDate(day);
    setShowModal(true);
  };

  // Handle item deletion
  const handleDeleteItem = (deletedId: string) => {
    setItems(prevItems => prevItems.filter(item => item._id !== deletedId));
  };

  // Check login status
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  // Toggle login state
  const toggleLogin = () => {
    const newLoginState = !isLoggedIn;
    setIsLoggedIn(newLoginState);
    localStorage.setItem('isLoggedIn', String(newLoginState));
  };

  // Fetch items when month changes
  useEffect(() => {
    fetchItems();
  }, [currentMonth]);

  // Generate calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </h1>
        
        <div className="flex gap-4">
          <button 
            onClick={handlePrevMonth}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button 
            onClick={handleNextMonth}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next
          </button>
          <button
            onClick={toggleLogin}
            className={`px-4 py-2 rounded ${isLoggedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>

      {/* Login status */}
      {isLoggedIn && (
        <div className="bg-blue-100 p-3 rounded mb-6">
          <p className="text-blue-800">
            Editing mode enabled. Click on a day to add or manage activities.
          </p>
        </div>
      )}

      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {monthDays.map(day => {
          const dayItems = items.filter(item => 
            isSameDay(parseISO(item.date), day)
          );
          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`min-h-24 p-2 border rounded ${
                isSameMonth(day, currentMonth) 
                  ? 'bg-white hover:bg-gray-50 cursor-pointer' 
                  : 'bg-gray-100'
              }`}
            >
              <div className="font-bold text-right">{format(day, 'd')}</div>
              <div className="mt-1 space-y-1 overflow-hidden max-h-20">
                {dayItems.slice(0, 2).map(item => (
                  <div 
                    key={item._id} 
                    className="text-xs p-1 bg-blue-100 rounded truncate"
                  >
                    {item.title}
                  </div>
                ))}
                {dayItems.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayItems.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity modal */}
      {showModal && selectedDate && (
        <AddItem
          selectedDate={selectedDate}
          items={items.filter(item => 
            isSameDay(parseISO(item.date), selectedDate)
          )}
          onClose={() => setShowModal(false)}
          onItemAdded={fetchItems}
          onDeleteItem={handleDeleteItem}
        />
      )}
    </div>
  );
}