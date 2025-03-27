'use client';

import { useEffect, useState } from 'react';
import { GrammarNote } from '../types';
import { BookOpenIcon, AcademicCapIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function GrammarPage() {
  const [notes, setNotes] = useState<GrammarNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/grammar');
      const data = await response.json();
      setNotes(data.notes);
    } catch (error) {
      console.error('Failed to fetch grammar notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(notes.map(note => note.category)));
  
  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchTerm === '' || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || note.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600 mr-2" />
              <span>French Grammar</span>
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-3xl">
              Master French grammar with clear explanations and practical examples.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={fetchNotes} 
              className="btn btn-ghost"
              aria-label="Refresh grammar notes"
              disabled={isLoading}
            >
              <ArrowPathIcon className={`h-5 w-5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === null 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-blue-50 to-white">
              <h2 className="text-lg font-medium text-blue-900 mb-3">Learning Tips</h2>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Focus on one grammar concept at a time</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Write your own examples to reinforce learning</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Practice grammar rules daily for better retention</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search grammar notes..."
                className="form-input pl-10 py-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading grammar notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">
                {searchTerm || selectedCategory ? 'No matching grammar notes found.' : 'No grammar notes available.'}
              </p>
              {(searchTerm || selectedCategory) && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                  }} 
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="grammar-card"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mb-2">
                        {note.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{note.explanation}</p>
                  
                  {note.examples.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Examples:</h4>
                      <div className="space-y-3">
                        {note.examples.map((example, index) => (
                          <div key={index} className="text-sm">
                            <p className="font-medium text-blue-700">{example.french}</p>
                            <p className="text-gray-600 italic">{example.english}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}