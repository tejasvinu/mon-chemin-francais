'use client';

import { useState } from 'react';
import { VocabularyEntry } from '../types';

interface VocabularyListProps {
  entries: VocabularyEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: VocabularyEntry) => void;
}

export default function VocabularyList({ entries, onDelete, onEdit }: VocabularyListProps) {
  return (
    <div className="mt-6">
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
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
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                  {entry.french}
                  {entry.audioUrl && (
                    <button
                      onClick={() => new Audio(entry.audioUrl).play()}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      🔊
                    </button>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{entry.english}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{entry.example}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {entry.nextReview ? new Date(entry.nextReview).toLocaleDateString() : 'Not scheduled'}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    onClick={() => onEdit(entry)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}