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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Abstract background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="blue" strokeWidth="0.5" opacity="0.1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="10%" cy="10%" r="50" fill="url(#blue-gradient)" className="animate-float-slow" />
          <circle cx="90%" cy="90%" r="70" fill="url(#red-gradient)" className="animate-float-medium" />
        </svg>
        <svg className="absolute w-full h-64 top-0" preserveAspectRatio="none">
          <defs>
            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="red-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M0,32 C200,100 400,0 600,50 C800,100 1000,0 1200,32 L1200,0 L0,0 Z" fill="url(#blue-gradient)" />
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
                  <BookOpenIcon className="h-12 w-12 text-blue-600 mr-4 flex-shrink-0" />
                  <span>Le Lexique</span>
                </h1>
                <p className="mt-3 text-lg text-gray-600">
                  Your evolving collection of French vocabulary, thoughtfully curated for your journey.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={fetchVocabulary}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all duration-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
             <motion.div
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md mb-6 shadow"
               role="alert"
             >
               <div className="flex items-start">
                 <div className="flex-shrink-0">
                   <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                 </div>
                 <div className="ml-3 flex-1 md:flex md:justify-between">
                   <p className="text-sm">{error}</p>
                   <button onClick={() => setError(null)} className="mt-2 md:mt-0 md:ml-6 text-sm font-medium text-red-600 hover:text-red-500">
                     Dismiss
                   </button>
                 </div>
               </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Debug Info Alert (Admin Only) */}
         <AnimatePresence>
          {debugInfo && session?.user?.role === 'admin' && ( // Example: Check for admin role
             <motion.div
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md mb-6 shadow"
             >
               <div className="flex items-start">
                 <div className="flex-shrink-0">
                   <WrenchScrewdriverIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                 </div>
                 <div className="ml-3 flex-1">
                   <h3 className="text-sm font-semibold">Debug Info (Admin Only):</h3>
                   <pre className="mt-2 text-xs overflow-auto max-h-40 bg-yellow-100 p-2 rounded">{debugInfo}</pre>
                   <button onClick={() => setDebugInfo(null)} className="mt-2 text-sm font-medium text-yellow-700 hover:text-yellow-600">
                     Dismiss
                   </button>
                 </div>
               </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Vocabulary Form Container */}
         <div id="vocabulary-form-container"> {/* Add ID for potential scrolling */}
             <AnimatePresence mode="wait"> {/* mode="wait" prevents overlap during transition */}
                  {isFormVisible && (
                      <motion.div
                          key="vocabulary-form"
                          variants={formVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200" // Added border
                      >
                          <div className="p-6">
                               <div className="flex justify-between items-center mb-4">
                                  <h2 className="text-xl font-semibold text-gray-900">
                                  {editingEntry ? 'Edit Vocabulary Entry' : 'Add New Vocabulary'}
                                  </h2>
                                  <button
                                  onClick={handleFormCancel}
                                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                  aria-label="Close form"
                                  >
                                  <XMarkIcon className="h-6 w-6" />
                                  </button>
                              </div>
                              <VocabularyForm
                                  onSubmit={handleSubmit}
                                  initialData={editingEntry}
                                  onCancel={handleFormCancel} // Pass cancel handler if form needs it
                              />
                          </div>
                      </motion.div>
                  )}
              </AnimatePresence>
         </div>


        {/* Main Content Grid */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8" variants={itemVariants}>

          {/* Sidebar */}
          <aside className="lg:col-span-1 order-last lg:order-first space-y-6">
              {/* Use motion.div for sidebar sections */}
              <motion.div variants={itemVariants} className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 p-8">
                   <div className="flex items-start">
                     <InformationCircleIcon className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                     <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">About Le Lexique</h2>
                        <p className="text-gray-600 leading-relaxed">
                          Build your French vocabulary systematically. Each word you learn is a new color in your palette of expression.
                        </p>
                     </div>
                </div>
              </motion.div>

              {/* Categories section with glass effect */}
              <motion.div variants={itemVariants} className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TagIcon className="h-5 w-5 mr-2 text-blue-500"/>
                  Catégories
                </h2>
                {categories.length > 0 ? (
                  <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {categories.map((category) => (
                      <li key={category} className="group">
                        <button
                          className="w-full flex items-center px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                          <span className={`h-2 w-2 rounded-full ${
                            category === 'Uncategorized' ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          } mr-3 flex-shrink-0`}></span>
                          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                            {category}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No categories assigned yet.</p>
                )}
              </motion.div>

              {/* Study Tips with artistic gradient */}
              <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700"></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative p-8">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-300"/>
                    Conseils d'Étude
                  </h2>
                  <ul className="space-y-3">
                    {[
                      "Practice regularly using flashcards",
                      "Create example sentences",
                      "Learn words in context",
                      "Review based on SRS levels"
                    ].map((tip, index) => (
                      <li key={index} className="flex items-start text-white/90">
                        <svg className="h-5 w-5 text-yellow-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
          </aside>

          {/* Main Vocabulary Section */}
          <motion.section className="lg:col-span-2" variants={itemVariants}>
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              {/* Search and Add Button Header */}
              <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <span>Entries</span>
                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {filteredEntries.length}
                    </span>
                  </h2>
                  <div className="flex-grow flex items-center justify-end gap-4">
                    <div className="relative flex-grow max-w-xs">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </span>
                      <input
                        type="search"
                        placeholder="Search entries..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl text-sm bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <AnimatePresence>
                      {!isFormVisible && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <button
                            onClick={handleAddClick}
                            className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <PlusIcon className="h-5 w-5 mr-1.5" />
                            Add Word
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Vocabulary List or Loading/Empty State */}
              <div className="p-4 md:p-0"> {/* Remove padding here if list adds its own */}
                {isLoading ? (
                  <div className="py-16 text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading Vocabulary...</p>
                  </div>
                ) : filteredEntries.length > 0 ? (
                  <VocabularyList
                    entries={filteredEntries}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    // readOnly={false} // Default is false
                  />
                ) : (
                  <div className="py-16 text-center px-6">
                    <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      {searchTerm ? 'No Matching Entries' : 'No Vocabulary Yet'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm
                        ? 'Try adjusting your search terms.'
                        : 'Click "Add New" to add your first word or phrase.'}
                    </p>
                     {!searchTerm && !isFormVisible && ( // Show Add button again in empty state if form isn't open
                         <div className="mt-6">
                              <button
                                  onClick={handleAddClick}
                                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                  Add New Vocabulary
                              </button>
                          </div>
                     )}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default withAuth(VocabularyPage); // Apply authentication HOC