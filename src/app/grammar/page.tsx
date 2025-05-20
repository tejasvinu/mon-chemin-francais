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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50 p-4 sm:p-6 lg:p-8">
      {/* Abstract background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <defs>
            <radialGradient id="grammar-bg-grad-1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(220, 38, 38, 0.05)" /> {/* red-600 with low opacity */}
              <stop offset="100%" stopColor="rgba(220, 38, 38, 0)" />
            </radialGradient>
            <radialGradient id="grammar-bg-grad-2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(124, 58, 237, 0.03)" /> {/* violet-600 with low opacity */}
              <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
            </radialGradient>
          </defs>
          <pattern id="grammar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(220, 38, 38, 0.1)" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grammar-grid)" />
          <circle cx="20%" cy="15%" r="200" fill="url(#grammar-bg-grad-1)" className="animate-float-slow opacity-60" />
          <circle cx="80%" cy="85%" r="250" fill="url(#grammar-bg-grad-2)" className="animate-float-medium opacity-50" />
        </svg>
      </div>

      <motion.div
        className="relative max-w-7xl mx-auto z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8 lg:mb-12">
          <div className="relative backdrop-blur-md bg-white/70 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-white/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 flex items-center">
                  <AcademicCapIcon className="h-7 w-7 sm:h-8 lg:h-10 text-red-600 mr-2.5 sm:mr-3 lg:mr-4 flex-shrink-0" />
                  <span className="truncate">La Structure</span>
                </h1>
                <p className="mt-1.5 sm:mt-2 text-sm sm:text-base lg:text-lg text-gray-600">
                  Master the architectural elegance of French grammar.
                </p>
              </div>
              <div className="flex-shrink-0 mt-3 sm:mt-0">
                <button
                  onClick={fetchGrammar}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md transition-all duration-150 disabled:opacity-60"
                  disabled={isLoading}
                >
                  <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Loading...' : 'Refresh Notes'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main content: Grammar notes and Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Sidebar (Order 2 on mobile, 1 on lg) */}
          <div className="lg:col-span-1 lg:order-1 w-full lg:max-w-xs flex-shrink-0">
            <div className="space-y-6 sm:space-y-8">
              {/* Search Input - Moved to top for mobile */}
              <motion.div variants={itemVariants} className="lg:hidden backdrop-blur-md bg-white/70 rounded-xl sm:rounded-2xl shadow-lg border border-white/30 p-4 sm:p-5">
                  <input
                    type="text"
                    placeholder="Search grammar notes..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg sm:rounded-xl text-sm bg-white/80 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
              </motion.div>

              {/* Categories */}
              <motion.div variants={itemVariants} className="backdrop-blur-md bg-white/70 rounded-xl sm:rounded-2xl shadow-lg border border-white/30 p-5 sm:p-6 lg:p-8">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Categories</h2>
                <div className="space-y-1.5 sm:space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-colors duration-150 ${
                      selectedCategory === null 
                        ? 'bg-red-100 text-red-700 font-medium' 
                        : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-colors duration-150 truncate ${
                        selectedCategory === category 
                          ? 'bg-red-100 text-red-700 font-medium' 
                          : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                  {categories.length === 0 && !isLoading && (
                     <p className="text-xs sm:text-sm text-gray-500 italic">No categories available.</p>
                  )}
                </div>
              </motion.div>

              {/* Learning Tips */}
              <motion.div variants={itemVariants} className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-700 opacity-90"></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative p-5 sm:p-6 lg:p-8">
                  <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Learning Tips</h2>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {[
                      "Focus on one concept at a time.",
                      "Write your own example sentences.",
                      "Practice rules daily for retention.",
                      "Relate grammar to real conversations."
                    ].map((tip, index) => (
                      <li key={index} className="flex items-start text-white/90">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-300 mr-2 sm:mr-2.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-2xs sm:text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Grammar Notes Area (Order 1 on mobile, 2 on lg) */}
          <motion.div className="lg:col-span-3 lg:order-2 w-full" variants={itemVariants}>
            <div className="backdrop-blur-md bg-white/70 rounded-xl sm:rounded-2xl shadow-lg border border-white/30 overflow-hidden">
              {/* Search Input for larger screens - hidden on mobile (handled in sidebar) */}
              <div className="p-4 sm:p-6 border-b border-gray-200/50 hidden lg:block">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search grammar notes..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white/80 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-red-500 border-t-transparent mb-4"></div>
                    <p className="text-base sm:text-lg font-medium">Loading Grammar Notes...</p>
                  </div>
                ) : filteredNotes.length > 0 ? (
                  <AnimatePresence>
                    <motion.ul
                      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4 sm:space-y-5"
                    >
                      {filteredNotes.map((note, index) => (
                        <GrammarNoteItem key={note._id || index} note={note} />
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                ) : (
                  <div className="text-center py-10 sm:py-16 text-gray-500">
                    <AcademicCapIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-red-400 mb-4" />
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">
                      {searchTerm ? 'No Matching Notes' : 'No Grammar Notes Available'}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base">
                      {searchTerm 
                        ? `No notes found for "${searchTerm}". Try a different search or category.`
                        : 'Check back soon or refresh for updates.'
                      }
                    </p>
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

// Simple GrammarNoteItem component - can be expanded or moved
function GrammarNoteItem({ note }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.li 
      variants={itemVariants}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-red-50/50 transition-colors duration-150 focus:outline-none focus:bg-red-50/70"
      >
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-red-800">{note.title}</h3>
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
          <svg className="h-5 w-5 text-red-500 transform transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto', marginTop: '0px', paddingBottom: '16px' }, // sm:paddingBottom: '20px'
              collapsed: { opacity: 0, height: 0, marginTop: '0px', paddingBottom: '0px' }
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="px-4 sm:px-5 text-gray-700 overflow-hidden"
          >
            <div className="prose prose-sm sm:prose-base max-w-none prose-headings:text-red-700 prose-a:text-red-600 hover:prose-a:text-red-700">
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">{note.explanation}</p>
                {note.examples && note.examples.length > 0 && (
                    <div className="mt-2 sm:mt-3">
                        <h4 className="text-xs sm:text-sm font-semibold text-red-700 mb-1">Examples:</h4>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                            {note.examples.map((ex, i) => (
                                <li key={i} className="text-2xs sm:text-xs text-gray-600">{ex}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}