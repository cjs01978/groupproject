'use client';
import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, parseISO } from 'date-fns';
import AddItem from './AddItem';
import { CalendarItem } from '../types/calendar';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch events from MongoDB for the current month
  const fetchItems = async () => {
    const month = format(currentMonth, 'MM');
    const year = format(currentMonth, 'yyyy');

    try {
      const res = await fetch(`/api/get-items?month=${month}&year=${year}`);
      const data = await res.json();
      if (data.success) {
        const events = data.items.map((item: CalendarItem) => ({
          ...item,
          date: new Date(item.date).toISOString(),
        }));
        setItems(events);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [currentMonth]);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const handleDateClick = (date: Date) => {
    if (!isLoggedIn) return;
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleItemAdded = () => {
    setShowModal(false);
    fetchItems();
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h1>
        <div className="flex gap-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="bg-gray-200 px-3 py-1 rounded">Prev</button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="bg-gray-200 px-3 py-1 rounded">Next</button>
          <button
            onClick={() => {
              const newState = !isLoggedIn;
              setIsLoggedIn(newState);
              localStorage.setItem('isLoggedIn', String(newState));
            }}
            className={`px-3 py-1 rounded text-white ${isLoggedIn ? 'bg-red-500' : 'bg-blue-500'}`}
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 text-center font-medium mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dayItems = items.filter(item => isSameDay(parseISO(item.date), day));
          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`min-h-[80px] border p-1 rounded cursor-pointer ${
                isSameMonth(day, currentMonth) ? 'bg-white' : 'bg-gray-100'
              } ${isSameDay(day, new Date()) ? 'border-blue-500' : ''}`}
            >
              <div className="text-right font-semibold text-sm">{format(day, 'd')}</div>
              {dayItems.map(item => (
                <div key={item._id} className="text-xs truncate bg-blue-100 px-1 rounded mt-1">{item.title}</div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Add item modal */}
      {showModal && selectedDate && (
        <AddItem
        selectedDate={selectedDate}
        onClose={() => setShowModal(false)}
        onItemAdded={handleItemAdded}
        items={items.filter(item => isSameDay(parseISO(item.date), selectedDate))}
        onDeleteItem={(id) => setItems(prev => prev.filter(item => item._id !== id))}
        isLoggedIn={isLoggedIn}
      />      
      )}
    </div>
  );
}
