'use client';

import { useState, useEffect, useCallback } from 'react';
import { AcademicCapIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export default function GrammarPage() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGrammar = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/grammar');
      if (!response.ok) throw new Error('Failed to fetch grammar notes');
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching grammar notes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrammar();
  }, [fetchGrammar]);

  const categories = [...new Set(notes.map(note => note.category))].filter(Boolean);
  const filteredNotes = notes.filter(note => 
    (!selectedCategory || note.category === selectedCategory) &&
    (!searchTerm || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.explanation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Abstract background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <pattern id="grammar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="red" strokeWidth="0.5" opacity="0.1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grammar-grid)" />
          <circle cx="10%" cy="10%" r="50" fill="url(#grammar-gradient)" className="animate-float-slow" />
          <circle cx="90%" cy="90%" r="70" fill="url(#accent-gradient)" className="animate-float-medium" />
        </svg>
        <svg className="absolute w-full h-64 top-0" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grammar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#3730a3" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M0,32 C200,100 400,0 600,50 C800,100 1000,0 1200,32 L1200,0 L0,0 Z" fill="url(#grammar-gradient)" />
        </svg>
      </div>

      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with glass effect */}
        <motion.header className="mb-12" variants={itemVariants}>
          <div className="relative backdrop-blur-sm bg-white/70 rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl flex items-center">
                  <AcademicCapIcon className="h-12 w-12 text-red-600 mr-4 flex-shrink-0" />
                  <span>La Structure</span>
                </h1>
                <p className="mt-3 text-lg text-gray-600">
                  Master the architectural elegance of French grammar through visual frameworks.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={fetchGrammar}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md transition-all duration-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <motion.div variants={itemVariants} className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 p-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                      selectedCategory === null 
                        ? 'bg-red-100 text-red-800' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        selectedCategory === category 
                          ? 'bg-red-100 text-red-800' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 p-8 bg-gradient-to-br from-red-50 to-white">
                <h2 className="text-lg font-medium text-red-900 mb-3">Learning Tips</h2>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Focus on one grammar concept at a time</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Write your own examples to reinforce learning</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Practice grammar rules daily for better retention</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Main content */}
          <motion.div className="lg:col-span-3" variants={itemVariants}>
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-gray-200/50">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search grammar notes..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl text-sm bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {filteredNotes.map((note) => (
                      <motion.div
                        key={note.id}
                        className="backdrop-blur-sm bg-white/90 rounded-xl shadow-md border border-gray-200/50 p-6 hover:shadow-lg transition-shadow duration-300"
                        variants={itemVariants}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mt-4">{note.explanation}</p>
                        
                        {note.examples.length > 0 && (
                          <div className="mt-4 bg-gradient-to-r from-red-50 to-white p-4 rounded-lg border border-red-100">
                            <h4 className="text-sm font-medium text-red-800 mb-2">Examples:</h4>
                            <div className="space-y-3">
                              {note.examples.map((example, index) => (
                                <div key={`${note.id}-example-${index}`} className="text-sm">
                                  <p className="font-medium text-red-700">{example.french}</p>
                                  <p className="text-gray-600 italic">{example.english}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}