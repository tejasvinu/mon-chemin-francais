// src/app/vocabulary/page.tsx
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import VocabularyList from '../components/VocabularyList';
import VocabularyForm from '../components/VocabularyForm';
import { VocabularyEntry } from '../types';
import {
  BookOpenIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import withAuth from '../components/withAuth';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

// Define animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger children animations
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  },
};

const formVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0, marginBottom: 0 },
    visible: {
        opacity: 1,
        height: 'auto',
        marginTop: '2rem', // Corresponds to mb-8
        marginBottom: '2rem',
        transition: { duration: 0.3, ease: "easeInOut" }
    },
    exit: {
        opacity: 0,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        transition: { duration: 0.2, ease: "easeInOut" }
    }
};

function VocabularyPage() {
  const [entries, setEntries] = useState<VocabularyEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<VocabularyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<VocabularyEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const { data: session } = useSession();

  // Use useCallback for fetchVocabulary to avoid unnecessary re-renders if passed as prop
  const fetchVocabulary = useCallback(async () => {
    // console.log('[DEBUG] Starting vocabulary fetch');
    setIsLoading(true);
    setError(null);
    setDebugInfo(null); // Clear debug on new fetch
    try {
      const response = await fetch('/api/vocabulary');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText || 'Failed to fetch'}`);
      }
      const data = await response.json();

      // Ensure data.entries is an array before mapping
      const fetchedEntries = Array.isArray(data?.entries) ? data.entries : [];

       if (fetchedEntries.length === 0 && data) {
           // Optionally provide debug info if response looks weird but has no entries
           setDebugInfo(`API returned OK but no entries found. Response: ${JSON.stringify(data).substring(0, 300)}...`);
       }

      // Map _id to id, ensure all needed fields are present
      const mappedEntries: VocabularyEntry[] = fetchedEntries.map(entry => ({
        id: entry._id, // Map MongoDB _id
        french: entry.french ?? '',
        english: entry.english ?? '',
        category: entry.category,
        example: entry.example,
        notes: entry.notes,
        srsLevel: entry.srsLevel,
        nextReview: entry.nextReview ? new Date(entry.nextReview) : undefined,
        createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(), // Fallback createdAt
        _id: entry._id // Keep _id if needed for API calls
      }));

      setEntries(mappedEntries);
    } catch (err: any) {
      console.error('[ERROR] Fetch vocabulary failed:', err);
      setError(`Failed to load vocabulary. Please check your connection and try again. (${err.message})`);
      setDebugInfo(`Error details: ${err.stack}`); // Provide stack in debug
    } finally {
      setIsLoading(false);
      // console.log('[DEBUG] Fetch completed');
    }
  }, []); // Empty dependency array, fetchVocabulary doesn't depend on component state directly

  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary]); // Fetch on mount

  // Filtering logic
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (lowerSearchTerm) {
      setFilteredEntries(
        entries.filter(
          (entry) =>
            entry.french.toLowerCase().includes(lowerSearchTerm) ||
            entry.english.toLowerCase().includes(lowerSearchTerm) ||
            entry.example?.toLowerCase().includes(lowerSearchTerm) ||
            entry.notes?.toLowerCase().includes(lowerSearchTerm) ||
            entry.category?.toLowerCase().includes(lowerSearchTerm)
        )
      );
    } else {
      setFilteredEntries(entries);
    }
  }, [entries, searchTerm]);

  // CRUD Handlers
  const handleSubmit = async (formData: Omit<VocabularyEntry, 'id' | 'createdAt' | '_id'> & { _id?: string }) => {
    // console.log('[DEBUG] Submitting form:', formData);
    const isEditing = Boolean(formData._id);
    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = '/api/vocabulary';

    // Prepare payload, ensuring _id is included for PUT
    const payload = { ...formData };

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText || 'Failed to save'}`);
      }

      const savedEntryData = await response.json();
      // Remap the saved entry to ensure consistency (API might return slightly different structure)
       const savedEntry: VocabularyEntry = {
         ...savedEntryData,
         id: savedEntryData._id,
         nextReview: savedEntryData.nextReview ? new Date(savedEntryData.nextReview) : undefined,
         createdAt: savedEntryData.createdAt ? new Date(savedEntryData.createdAt) : new Date(),
       };

      if (isEditing) {
        setEntries(prevEntries =>
          prevEntries.map(e => (e.id === savedEntry.id ? savedEntry : e))
        );
      } else {
        setEntries(prevEntries => [savedEntry, ...prevEntries]); // Add new entries to the top
      }

      setIsFormVisible(false);
      setEditingEntry(null);
      setError(null); // Clear error on success
    } catch (err: any) {
      console.error(`[ERROR] Failed to ${isEditing ? 'update' : 'add'} vocabulary:`, err);
      setError(`Failed to save entry. ${err.message}`);
    }
  };

  const handleEdit = (entry: VocabularyEntry) => {
    setEditingEntry(entry);
    setIsFormVisible(true);
    // Optional: Scroll form into view smoothly if needed
    // document.getElementById('vocabulary-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = async (id: string) => {
    // Find the entry to get the _id if your API requires it, assuming `id` is the `_id` string here.
    // const entryToDelete = entries.find(e => e.id === id);
    // if (!entryToDelete) return;
    // const apiId = entryToDelete._id; // Use _id if API expects it

    try {
      // Assume API uses the 'id' parameter which contains the _id string
      const response = await fetch(`/api/vocabulary?id=${id}`, { method: 'DELETE' });

      if (!response.ok) {
         const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText || 'Failed to delete'}`);
      }

      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
      setError(null); // Clear error on success
    } catch (err: any) {
      console.error('[ERROR] Failed to delete vocabulary:', err);
      setError(`Failed to delete entry. ${err.message}`);
    }
  };

  const handleAddClick = () => {
    setEditingEntry(null);
    setIsFormVisible(true);
     // Optional: Scroll form into view smoothly
     // document.getElementById('vocabulary-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingEntry(null);
  };

  // Memoize categories calculation
  const categories = useMemo(() =>
    Array.from(new Set(entries.map(entry => entry.category || 'Uncategorized')))
      .sort() // Sort categories alphabetically
  , [entries]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Abstract background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <defs>
            <radialGradient id="blue-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </radialGradient>
            <radialGradient id="red-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.05)" />
              <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
            </radialGradient>
          </defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="10%" cy="10%" r="150" fill="url(#blue-gradient)" className="animate-float-slow opacity-50" />
          <circle cx="90%" cy="90%" r="200" fill="url(#red-gradient)" className="animate-float-medium opacity-50" />
        </svg>
      </div>

      <motion.div 
        className="relative max-w-7xl mx-auto z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center">
              <BookOpenIcon className="h-8 w-8 sm:h-10 sm:w-10 mr-3 text-blue-600" />
              My Vocabulary
            </h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleAddClick}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New Word
              </button>
              <button
                onClick={() => fetchVocabulary()}
                disabled={isLoading}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50"
              >
                <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh List'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search Input */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your vocabulary (e.g., 'bonjour', 'common phrases', 'verb')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Conditional Form Rendering */}
        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              id="vocabulary-form-container"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-4 sm:p-6 rounded-xl shadow-xl mb-6 sm:mb-8 border border-gray-200"
            >
              <VocabularyForm
                onSubmit={handleSubmit}
                onCancel={handleFormCancel}
                initialData={editingEntry}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {error && (
          <motion.div 
            variants={itemVariants} 
            className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg shadow-md flex items-start"
          >
            <ExclamationTriangleIcon className="h-6 w-6 mr-3 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold">An error occurred:</p>
              <p className="text-sm">{error}</p>
              {debugInfo && (
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer hover:underline">Show debug info</summary>
                  <pre className="mt-1 p-2 bg-red-50 rounded whitespace-pre-wrap break-all">{debugInfo}</pre>
                </details>
              )}
            </div>
            <button onClick={() => { setError(null); setDebugInfo(null); }} className="ml-auto text-red-500 hover:text-red-700">
                <XMarkIcon className="h-5 w-5"/>
            </button>
          </motion.div>
        )}
        
        {/* Debug Info Display (if no error but debug info exists) */}
        {!error && debugInfo && (
             <motion.div 
                variants={itemVariants} 
                className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg shadow-sm flex items-start"
             >
                <InformationCircleIcon className="h-6 w-6 mr-3 text-blue-500 flex-shrink-0" />
                <div>
                    <p className="font-semibold">Developer Information:</p>
                    <p className="text-sm">{debugInfo}</p>
                </div>
                <button onClick={() => setDebugInfo(null)} className="ml-auto text-blue-500 hover:text-blue-700">
                    <XMarkIcon className="h-5 w-5"/>
                </button>
             </motion.div>
        )}


        {/* Loading State or Content */}
        <motion.div variants={itemVariants}>
          {isLoading && filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500 py-10 sm:py-20">
              <ArrowPathIcon className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500 animate-spin mb-4" />
              <p className="text-lg sm:text-xl font-medium">Loading your vocabulary...</p>
              <p className="text-sm">Please wait a moment.</p>
            </div>
          ) : !isLoading && entries.length === 0 && !error ? (
            // Enhanced Empty State
            <div className="text-center py-10 sm:py-20 bg-white rounded-lg shadow-lg border border-gray-200">
                <WrenchScrewdriverIcon className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-gray-400 mb-6" />
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-3">Your Vocabulary List is Empty</h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto px-4">
                    It looks like you haven't added any words or phrases yet. 
                    Start building your personal French dictionary!
                </p>
                <button
                    onClick={handleAddClick}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-150 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Your First Word
                </button>
                <div className="mt-8 text-sm text-gray-400 flex items-center justify-center">
                    <LightBulbIcon className="h-4 w-4 mr-1.5"/>
                    <span>Tip: Add words you encounter in lessons, conversations, or media.</span>
                </div>
            </div>
          ) : (
            <>
              {/* Categories/Filter Section (Optional - if you plan to add category filters) */}
              {/* 
              <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
                <button className="px-3 py-1.5 text-xs sm:text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600">All</button>
                {categories.map(category => (
                  <button 
                    key={category}
                    className="px-3 py-1.5 text-xs sm:text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 flex items-center"
                  >
                    <TagIcon className="h-3.5 w-3.5 mr-1.5 text-gray-500"/> 
                    {category}
                  </button>
                ))}
              </div> 
              */}
              
              <VocabularyList
                entries={filteredEntries}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {filteredEntries.length === 0 && searchTerm && !isLoading && (
                <div className="text-center py-10 sm:py-16 text-gray-500 bg-white rounded-lg shadow border border-gray-200 mt-6">
                  <MagnifyingGlassIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">No Results Found</h3>
                  <p className="mt-2 text-sm">
                    No entries match your search term "{searchTerm}". Try a different search.
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default withAuth(VocabularyPage);