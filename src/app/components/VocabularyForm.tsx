'use client';

import { useState, useEffect } from 'react';
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
    notes: initialData?.notes || '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [fieldFocus, setFieldFocus] = useState<string | null>(null);

  // Reset form when initialData changes (e.g., when switching from add to edit)
  useEffect(() => {
    setFormData({
      french: initialData?.french || '',
      english: initialData?.english || '',
      example: initialData?.example || '',
      notes: initialData?.notes || '',
    });
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await onSubmit(formData);
      
      if (!initialData) {
        setFormData({ french: '', english: '', example: '', notes: '' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <label 
          htmlFor="french" 
          className={`text-sm font-medium transition-all duration-200 ${
            fieldFocus === 'french' ? 'text-blue-600' : 'text-gray-700'
          }`}
        >
          French Word
        </label>
        <div className="mt-1 relative rounded-md">
          <input
            type="text"
            id="french"
            value={formData.french}
            onChange={(e) => setFormData({ ...formData, french: e.target.value })}
            onFocus={() => setFieldFocus('french')}
            onBlur={() => setFieldFocus(null)}
            className="form-input block w-full pr-10"
            placeholder="e.g. bonjour"
            required
          />
          {fieldFocus === 'french' && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <label 
          htmlFor="english" 
          className={`text-sm font-medium transition-all duration-200 ${
            fieldFocus === 'english' ? 'text-blue-600' : 'text-gray-700'
          }`}
        >
          English Translation
        </label>
        <div className="mt-1 relative rounded-md">
          <input
            type="text"
            id="english"
            value={formData.english}
            onChange={(e) => setFormData({ ...formData, english: e.target.value })}
            onFocus={() => setFieldFocus('english')}
            onBlur={() => setFieldFocus(null)}
            className="form-input block w-full pr-10"
            placeholder="e.g. hello"
            required
          />
          {fieldFocus === 'english' && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <label 
          htmlFor="example" 
          className={`text-sm font-medium transition-all duration-200 ${
            fieldFocus === 'example' ? 'text-blue-600' : 'text-gray-700'
          }`}
        >
          Example Sentence <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="mt-1">
          <textarea
            id="example"
            value={formData.example}
            onChange={(e) => setFormData({ ...formData, example: e.target.value })}
            onFocus={() => setFieldFocus('example')}
            onBlur={() => setFieldFocus(null)}
            rows={2}
            className="form-input block w-full"
            placeholder="e.g. Bonjour, comment ça va?"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Add a sentence that shows how to use this word in context
        </p>
      </div>

      <div className="relative">
        <label 
          htmlFor="notes" 
          className={`text-sm font-medium transition-all duration-200 ${
            fieldFocus === 'notes' ? 'text-blue-600' : 'text-gray-700'
          }`}
        >
          Notes <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="mt-1">
          <textarea
            id="notes"
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            onFocus={() => setFieldFocus('notes')}
            onBlur={() => setFieldFocus(null)}
            rows={2}
            className="form-input block w-full"
            placeholder="e.g. Used in formal settings"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${isSaving ? 'opacity-80 cursor-not-allowed' : ''}`}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>{initialData ? 'Update' : 'Add'} Vocabulary</>
          )}
        </button>
      </div>
    </form>
  );
}