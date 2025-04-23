'use client';
import { useState } from 'react';
import { CalendarItem } from '../types/calendar';

interface AddItemProps {
  selectedDate: Date;
  onClose: () => void;
  onItemAdded: () => void;
  items: CalendarItem[];
  onDeleteItem: (id: string) => void;
  isLoggedIn: boolean;
}

export default function AddItem({
  selectedDate,
  onClose,
  onItemAdded,
  items,
  onDeleteItem,
  isLoggedIn,
}: AddItemProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          date: selectedDate.toISOString().split('T')[0],
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to add item');
      }

      // Reset form and refresh calendar
      setTitle('');
      setDescription('');
      setImageUrl('');
      onItemAdded();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this activity?')) return;

    try {
      const res = await fetch('/api/delete-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete');
      }

      onDeleteItem(id); // Remove from UI
      onItemAdded();    // Refresh calendar
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-3 text-xl text-gray-500 hover:text-gray-700"
          onClick={onClose}
          disabled={isSubmitting}
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-2 text-center">Activities on {selectedDate.toDateString()}</h2>

        {/* Existing items */}
        {items.length > 0 && (
          <div className="mb-4 space-y-2">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between items-center border p-2 rounded">
                <div className="text-sm truncate">{item.title}</div>
                {isLoggedIn && (
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    disabled={isSubmitting}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded h-20"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
          <input
            type="url"
            placeholder="Image URL"
            className="w-full p-2 border rounded"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Activity'}
          </button>
        </form>
      </div>
    </div>
  );
}
