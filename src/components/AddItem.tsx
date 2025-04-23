'use client';
import { useEffect, useState } from 'react';
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
  const [editingItem, setEditingItem] = useState<CalendarItem | null>(null);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description || '');
      setImageUrl(editingItem.imageUrl || '');
    } else {
      setTitle('');
      setDescription('');
      setImageUrl('');
    }
  }, [editingItem]);

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

      onItemAdded();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/edit-item', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem._id,
          title,
          description,
          imageUrl,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Update failed');
      }

      setEditingItem(null);
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
        throw new Error(result.error || 'Delete failed');
      }

      onDeleteItem(id);
      onItemAdded();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete');
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

        <h2 className="text-xl font-bold mb-2 text-center">
          {editingItem ? 'Edit Activity' : 'Add Activity'}
        </h2>
        <p className="text-sm mb-4 text-center text-gray-600">{selectedDate.toDateString()}</p>

        {/* List existing items */}
        {items.length > 0 && (
          <div className="mb-4 space-y-2 max-h-52 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div className="text-sm truncate">{item.title}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="text-blue-500 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Form */}
        <form onSubmit={editingItem ? handleEdit : handleSubmit} className="space-y-4">
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
            {isSubmitting ? 'Saving...' : editingItem ? 'Update Activity' : 'Add Activity'}
          </button>
        </form>
      </div>
    </div>
  );
}
