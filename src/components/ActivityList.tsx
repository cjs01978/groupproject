import { CalendarItem } from '../types/calendar';

export default function ActivityList({ items }: { items: CalendarItem[] }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-500">No activities today.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item._id} className="flex bg-gray-100 p-4 rounded">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-24 h-24 object-cover rounded mr-4"
            />
          )}
          <div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="text-xs text-gray-400 mt-1">{item.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

