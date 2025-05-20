'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VocabularyFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  onCancel?: () => void;
}

export default function VocabularyForm({ onSubmit, initialData, onCancel }: VocabularyFormProps) {
  const [formData, setFormData] = useState({
    french: '',
    english: '',
    example: '',
    notes: '',
    category: '',
    _id: undefined
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        french: initialData.french || '',
        english: initialData.english || '',
        example: initialData.example || '',
        notes: initialData.notes || '',
        category: initialData.category || '',
        _id: initialData._id
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* French Word/Phrase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label htmlFor="french" className="block text-sm font-medium text-gray-700 mb-1">
            French Word/Phrase *
          </label>
          <input
            type="text"
            id="french"
            name="french"
            required
            value={formData.french}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg sm:rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm p-2.5 sm:p-2 text-sm sm:text-base"
            placeholder="e.g., bonjour"
          />
        </motion.div>

        {/* English Translation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="english" className="block text-sm font-medium text-gray-700 mb-1">
            English Translation *
          </label>
          <input
            type="text"
            id="english"
            name="english"
            required
            value={formData.english}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg sm:rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm p-2.5 sm:p-2 text-sm sm:text-base"
            placeholder="e.g., hello"
          />
        </motion.div>
      </div>

      {/* Example Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label htmlFor="example" className="block text-sm font-medium text-gray-700 mb-1">
          Example Usage
        </label>
        <input
          type="text"
          id="example"
          name="example"
          value={formData.example}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg sm:rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm p-2.5 sm:p-2 text-sm sm:text-base"
          placeholder="e.g., Bonjour, comment allez-vous?"
        />
      </motion.div>

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg sm:rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm p-2.5 sm:p-2 text-sm sm:text-base"
          placeholder="Add any additional notes or context..."
        />
      </motion.div>

      {/* Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg sm:rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm p-2.5 sm:p-2 text-sm sm:text-base"
          placeholder="e.g., Greetings, Numbers, Colors..."
        />
      </motion.div>

      {/* Form Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2"
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg sm:rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all duration-150"
        >
          {initialData ? 'Update' : 'Add'} Entry
        </button>
      </motion.div>
    </form>
  );
}