// components/CalendarEdit.tsx
'use client';
import useCalendarData from '@/hooks/useCalendarData';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, format } from 'date-fns';
import { useState } from 'react';
import AddItem from './AddItem';

export default function CalendarEdit() {
  const { currentMonth, items, fetchItems, setItems, handlePrevMonth, handleNextMonth } = useCalendarData();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setShowModal(true);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item._id !== id));
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="bg-gray-200 px-3 py-1 rounded">Prev</button>
          <button onClick={handleNextMonth} className="bg-gray-200 px-3 py-1 rounded">Next</button>
        </div>
      </div>

      <div className="bg-blue-100 p-3 rounded mb-6">
        <p className="text-blue-800">Click a day to add or manage activities.</p>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayItems = items.filter(item => isSameDay(parseISO(item.date), day));
          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className="p-2 border rounded min-h-24 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <div className="text-sm font-bold text-right">{format(day, 'd')}</div>
              {dayItems.slice(0, 2).map(item => (
                <div key={item._id} className="text-xs bg-blue-100 mt-1 p-1 rounded truncate">
                  {item.title}
                </div>
              ))}
              {dayItems.length > 2 && (
                <div className="text-xs text-gray-400">+{dayItems.length - 2} more</div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && selectedDate && (
        <AddItem
          selectedDate={selectedDate}
          items={items.filter(item => isSameDay(parseISO(item.date), selectedDate))}
          onClose={() => setShowModal(false)}
          onItemAdded={fetchItems}
          onDeleteItem={handleDeleteItem}
        />
      )}
    </div>
  );
}
