// components/AddItem.tsx
'use client';
import { useState } from 'react';

export default function AddItem({ selectedDate, onClose }: { selectedDate: string, onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, description, imageUrl, selectedDate });

    // Clear inputs
    setTitle('');
    setDescription('');
    setImageUrl('');

    onClose(); // close modal
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-20 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-2">Editing an Activity</h2>
        <p className="text-sm mb-4">{selectedDate}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Activity Title"
            className="border p-2 w-full mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Activity Description"
            className="border p-2 w-full mb-2 h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            className="border p-2 w-full mb-4"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button type="submit" className="bg-gray-300 px-4 py-2 rounded w-full">Submit</button>
        </form>
      </div>
    </div>
  );
}
