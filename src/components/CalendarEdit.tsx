'use client';
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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddItem from './AddItem';

export default function CalendarEdit() {
    const router = useRouter();
    const {
        currentMonth,
        items,
        fetchItems,
        setItems,
        handlePrevMonth,
        handleNextMonth,
    } = useCalendarData();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleDateClick = (day: Date) => {
        setSelectedDate(day);
        setShowModal(true);
    };

    const handleDeleteItem = (id: string) => {
        setItems(prev => prev.filter(item => item._id !== id));
    };

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDayIndex = getDay(monthStart); // 0 = Sunday, 6 = Saturday
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
        <div className="min-h-screen bg-white p-6">
            {/* Header */}
            <button
                onClick={() => router.push('/')}
                className="mb-4 text-blue-600 hover:underline font-medium"
            >
                ← Go back home
            </button>
            <div className="flex justify-between items-center mb-4">
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

            {/* Edit mode message */}
            <div className="bg-blue-100 p-3 rounded mb-6">
                <p className="text-blue-800">Click a day to add or manage activities.</p>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm font-semibold text-gray-600">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            {/* Calendar grid with padding */}
            <div className="grid grid-cols-7 gap-1">
                {/* Empty boxes before the first day of the month */}
                {[...Array(startDayIndex)].map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        className="p-2 border rounded min-h-24 bg-gray-100 opacity-50"
                    />
                ))}

                {/* Actual days */}
                {days.map(day => {
                    const dayItems = items.filter(item => isSameDay(parseISO(item.date), day));
                    return (
                        <div
                            key={day.toString()}
                            onClick={() => handleDateClick(day)}
                            className="p-2 border rounded min-h-24 bg-white hover:bg-gray-50 cursor-pointer"
                        >
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
                                <div className="text-xs text-gray-400">
                                    +{dayItems.length - 2} more
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
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
