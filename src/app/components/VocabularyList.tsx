'use client';

import { useState } from 'react';
import { VocabularyEntry } from '../types';

interface VocabularyListProps {
  entries: VocabularyEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: VocabularyEntry) => void;
}

export default function VocabularyList({ entries, onEdit, onDelete }: VocabularyListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEntries = entries.filter(entry => 
    entry.french.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.english.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center bg-white rounded-lg shadow-sm p-2">
        <input
          type="text"
          placeholder="Search vocabulary..."
          className="flex-1 border-0 focus:ring-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      {filteredEntries.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg shadow-sm">
          <p className="text-gray-500 italic">No vocabulary entries found.</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  French
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  English
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Example
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Next Review
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 pl-4 pr-3 text-sm">
                    <div className="font-medium text-gray-900">{entry.french}</div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">{entry.english}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {entry.example ? (
                      <span className="italic">{entry.example}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm">
                    {entry.nextReview ? (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        new Date(entry.nextReview) < new Date() 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {new Date(entry.nextReview).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        Not scheduled
                      </span>
                    )}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      onClick={() => onEdit(entry)}
                      className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                      aria-label={`Edit ${entry.french}`}
                    >
                      <span className="hidden sm:inline">Edit</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      aria-label={`Delete ${entry.french}`}
                    >
                      <span className="hidden sm:inline">Delete</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}