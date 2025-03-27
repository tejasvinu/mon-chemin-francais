'use client';

import { useEffect, useState } from 'react';
import { GrammarNote } from '../types';

export default function GrammarPage() {
  const [notes, setNotes] = useState<GrammarNote[]>([]);
  const [editingNote, setEditingNote] = useState<GrammarNote | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    explanation: '',
    category: '',
    examples: [{ french: '', english: '', hiddenParts: [] }],
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await fetch('/api/grammar');
    const data = await response.json();
    setNotes(data.notes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNote) {
      await fetch('/api/grammar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingNote.id }),
      });
      setEditingNote(null);
    } else {
      await fetch('/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }

    setFormData({
      title: '',
      explanation: '',
      category: '',
      examples: [{ french: '', english: '', hiddenParts: [] }],
    });
    fetchNotes();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/grammar?id=${id}`, { method: 'DELETE' });
    fetchNotes();
  };

  const handleEdit = (note: GrammarNote) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      explanation: note.explanation,
      category: note.category,
      examples: note.examples,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, { french: '', english: '', hiddenParts: [] }],
    }));
  };

  const updateExample = (index: number, field: 'french' | 'english', value: string) => {
    const newExamples = [...formData.examples];
    newExamples[index] = { ...newExamples[index], [field]: value };
    setFormData(prev => ({ ...prev, examples: newExamples }));
  };

  const removeExample = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Form Section */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingNote ? 'Edit Grammar Note' : 'Add New Grammar Note'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Explanation</label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Examples</label>
                <button
                  type="button"
                  onClick={addExample}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Example
                </button>
              </div>
              
              {formData.examples.map((example, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={example.french}
                      onChange={(e) => updateExample(index, 'french', e.target.value)}
                      placeholder="French"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={example.english}
                      onChange={(e) => updateExample(index, 'english', e.target.value)}
                      placeholder="English"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeExample(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {editingNote ? 'Update' : 'Save'} Grammar Note
              </button>
              {editingNote && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingNote(null);
                    setFormData({
                      title: '',
                      explanation: '',
                      category: '',
                      examples: [{ french: '', english: '', hiddenParts: [] }],
                    });
                  }}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Notes List Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Grammar Notes</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white shadow-sm rounded-lg p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                    <p className="text-sm text-gray-500">{note.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{note.explanation}</p>
                
                <div className="space-y-2">
                  {note.examples.map((example, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-gray-900">{example.french}</p>
                      <p className="text-gray-600">{example.english}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}