'use client';

import { useState } from 'react';
import { VocabularyEntry } from '../types';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface VocabularyListProps {
  entries: VocabularyEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: VocabularyEntry) => void;
  readOnly?: boolean;
}

export default function VocabularyList({ entries, onEdit, onDelete, readOnly = false }: VocabularyListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setDeleteConfirmId(null);
    }, 3000);
  };
  
  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="divide-y divide-gray-200">
      {entries.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 italic">No vocabulary entries found.</p>
        </div>
      ) : (
        entries.map((entry) => (
          <div 
            key={entry.id}
            className={`vocabulary-item p-4 transition-all duration-200 ${expandedId === entry.id ? 'bg-blue-50' : ''}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-grow">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-blue-900">{entry.french}</h3>
                  
                  {/* SRS Level Badge */}
                  <span 
                    className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                      !entry.srsLevel || entry.srsLevel < 3
                        ? 'bg-red-100 text-red-800'
                        : entry.srsLevel < 6
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {!entry.srsLevel ? 'New' : `Level ${entry.srsLevel}`}
                  </span>
                </div>
                
                <div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
                  <span>{entry.english}</span>
                  {entry.nextReview && (
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className={`${new Date(entry.nextReview) < new Date() ? 'text-red-600 font-medium' : ''}`}>
                        {new Date(entry.nextReview).toLocaleDateString()}
                      </span>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <button
                  onClick={() => toggleExpand(entry.id)}
                  className="p-1 rounded-full text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  {expandedId === entry.id ? (
                    <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                  <span className="sr-only">{expandedId === entry.id ? 'Hide details' : 'Show details'}</span>
                </button>
                {!readOnly && (
                  <>
                    <button
                      onClick={() => onEdit(entry)}
                      className="p-1 rounded-full text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                      aria-label={`Edit ${entry.french}`}
                    >
                      <PencilIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {deleteConfirmId === entry.id ? (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Confirm?</span>
                        <button 
                          onClick={() => handleDelete(entry.id)} 
                          className="font-medium text-red-600 hover:text-red-800 transition-colors"
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(null)} 
                          className="font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => confirmDelete(entry.id)}
                        className="p-1 rounded-full text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        aria-label={`Delete ${entry.french}`}
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {/* Expanded details */}
            {expandedId === entry.id && (
              <div className="mt-4 pl-4 border-l-2 border-blue-200 animate-fade-in">
                {entry.example && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-700">Example:</h4>
                    <p className="mt-1 text-sm text-gray-600 italic">{entry.example}</p>
                  </div>
                )}
                
                {entry.notes && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700">Notes:</h4>
                    <p className="mt-1 text-sm text-gray-600">{entry.notes}</p>
                  </div>
                )}
                
                <div className="mt-3 text-sm text-gray-500">
                  Created: {new Date(entry.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}