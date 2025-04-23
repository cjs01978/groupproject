'use client';
import { useRouter } from 'next/navigation';
import useCalendarData from '@/hooks/useCalendarData';
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    parseISO,
    format,
    getDay,
} from 'date-fns';
import { useEffect, useState } from 'react';

export default function CalendarView() {
    const router = useRouter();
    const { currentMonth, items, fetchItems, handlePrevMonth, handleNextMonth } = useCalendarData();

    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated) {
            fetchItems();
        }
    }, [hydrated, currentMonth]);

    if (!hydrated) {
        return <p className="text-center mt-10 text-gray-500">Loading calendar...</p>;
    }

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDayIndex = getDay(monthStart); // 0 (Sunday) to 6 (Saturday)

    return (
        <div className="min-h-screen bg-white p-6">
            {/* Header */}
            <button
                onClick={() => router.push('/')}
                className="mb-4 text-blue-600 hover:underline font-medium"
            >
                ← Go back home
            </button>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
                <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="bg-gray-200 px-3 py-1 rounded">
                        Prev
                    </button>
                    <button onClick={handleNextMonth} className="bg-gray-200 px-3 py-1 rounded">
                        Next
                    </button>
                </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm font-semibold text-gray-600">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Empty cells before first day of month */}
                {[...Array(startDayIndex)].map((_, i) => (
                    <div key={`empty-${i}`} className="p-2 border rounded min-h-24 bg-gray-100 opacity-50" />
                ))}

                {/* Calendar days */}
                {days.map(day => {
                    const dayItems = items.filter(item => isSameDay(parseISO(item.date), day));
                    return (
                        <div key={day.toString()} className="p-2 border rounded min-h-24 bg-white">
                            <div className="text-sm font-bold text-right">{format(day, 'd')}</div>
                            {dayItems.slice(0, 2).map(item => (
                                <div
                                    key={item._id}
                                    className="text-xs bg-blue-100 mt-1 p-1 rounded truncate"
                                >
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
