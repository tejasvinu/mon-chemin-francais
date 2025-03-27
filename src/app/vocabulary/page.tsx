'use client';

import { useEffect, useState } from 'react';
import VocabularyForm from '../components/VocabularyForm';
import VocabularyList from '../components/VocabularyList';
import { VocabularyEntry } from '../types';

export default function VocabularyPage() {
  const [entries, setEntries] = useState<VocabularyEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<VocabularyEntry | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const response = await fetch('/api/vocabulary');
    const data = await response.json();
    setEntries(data.entries);
  };

  const handleSubmit = async (formData: Omit<VocabularyEntry, 'id' | 'createdAt' | 'srsLevel'>) => {
    if (editingEntry) {
      await fetch('/api/vocabulary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingEntry.id }),
      });
      setEditingEntry(null);
    } else {
      await fetch('/api/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }
    fetchEntries();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/vocabulary?id=${id}`, { method: 'DELETE' });
    fetchEntries();
  };

  const handleEdit = (entry: VocabularyEntry) => {
    setEditingEntry(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {editingEntry ? 'Edit Vocabulary Entry' : 'Add New Vocabulary'}
          </h2>
          <VocabularyForm
            onSubmit={handleSubmit}
            initialData={editingEntry || undefined}
          />
          {editingEntry && (
            <button
              onClick={() => setEditingEntry(null)}
              className="mt-4 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel Editing
            </button>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vocabulary List</h2>
          <VocabularyList
            entries={entries}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
}