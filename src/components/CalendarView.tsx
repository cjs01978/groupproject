// components/CalendarView.tsx
'use client';
import useCalendarData from '@/hooks/useCalendarData';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, format } from 'date-fns';

export default function CalendarView() {
  const { currentMonth, items, handlePrevMonth, handleNextMonth } = useCalendarData();

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

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayItems = items.filter(item => isSameDay(parseISO(item.date), day));
          return (
            <div key={day.toString()} className="p-2 border rounded min-h-24 bg-white">
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
    </div>
  );
}
