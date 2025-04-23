'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarItem } from '../types/calendar';

interface AddItemProps {
  selectedDate: Date;
  items: CalendarItem[];
  onClose: () => void;
  onItemAdded: () => void;
  onDeleteItem: (id: string) => void;
}

export default function AddItem({ 
  selectedDate, 
  items,
  onClose, 
  onItemAdded,
  onDeleteItem
}: AddItemProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'view' | 'add'>('view');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
      title,
      description,
      imageUrl,
      date: format(selectedDate, 'yyyy-MM-dd')
    };
    
    console.log('Submitting:', itemData);
  
    try {
      const res = await fetch('/api/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      
      const data = await res.json();
      console.log('Response data:', data);
  
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add item');
      }
  
      onItemAdded();
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/delete-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        onDeleteItem(id);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">×</button>
        </div>

        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${activeTab === 'view' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            View Activities
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'add' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add New
          </button>
        </div>

        {activeTab === 'view' ? (
          <div className="space-y-2">
            {items.length === 0 ? (
              <p className="text-gray-500">No activities for this day</p>
            ) : (
              items.map(item => (
                <div key={item._id} className="border p-3 rounded-lg relative">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                  <h3 className="font-bold">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  )}
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="mt-2 w-full h-auto rounded" 
                    />
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Title*</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded h-24"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Add Activity
            </button>
          </form>
        )}
      </div>
    </div>
  );
}