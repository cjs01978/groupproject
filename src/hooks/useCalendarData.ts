
import { useState, useEffect } from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import { CalendarItem } from '@/types/calendar';

export default function useCalendarData() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [items, setItems] = useState<CalendarItem[]>([]);

  const fetchItems = async () => {
    const month = format(currentMonth, 'MM');
    const year = format(currentMonth, 'yyyy');
    const res = await fetch(`/api/get-items?month=${month}&year=${year}`);
    const data = await res.json();
    if (data.success) setItems(data.items);
  };

  useEffect(() => {
    fetchItems();
  }, [currentMonth]);

  return {
    currentMonth,
    items,
    setItems,
    fetchItems,
    handlePrevMonth: () => setCurrentMonth(subMonths(currentMonth, 1)),
    handleNextMonth: () => setCurrentMonth(addMonths(currentMonth, 1)),
  };
}
