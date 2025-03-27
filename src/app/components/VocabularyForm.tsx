'use client';

import { useState } from 'react';
import { VocabularyEntry } from '../types';

interface VocabularyFormProps {
  onSubmit: (entry: Omit<VocabularyEntry, 'id' | 'createdAt' | 'srsLevel'>) => void;
  initialData?: VocabularyEntry;
}

export default function VocabularyForm({ onSubmit, initialData }: VocabularyFormProps) {
  const [formData, setFormData] = useState({
    french: initialData?.french || '',
    english: initialData?.english || '',
    example: initialData?.example || '',
    audioUrl: initialData?.audioUrl || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({ french: '', english: '', example: '', audioUrl: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="french" className="block text-sm font-medium text-gray-700">
          Mot Français
        </label>
        <input
          type="text"
          id="french"
          value={formData.french}
          onChange={(e) => setFormData({ ...formData, french: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="english" className="block text-sm font-medium text-gray-700">
          English Translation
        </label>
        <input
          type="text"
          id="english"
          value={formData.english}
          onChange={(e) => setFormData({ ...formData, english: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="example" className="block text-sm font-medium text-gray-700">
          Exemple (optionnel)
        </label>
        <input
          type="text"
          id="example"
          value={formData.example}
          onChange={(e) => setFormData({ ...formData, example: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="audioUrl" className="block text-sm font-medium text-gray-700">
          Audio URL (optionnel)
        </label>
        <input
          type="url"
          id="audioUrl"
          value={formData.audioUrl}
          onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {initialData ? 'Update' : 'Add'} Vocabulary
      </button>
    </form>
  );
}