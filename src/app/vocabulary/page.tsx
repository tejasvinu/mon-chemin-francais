'use client';

import { useEffect, useState } from 'react';
import VocabularyList from '../components/VocabularyList';
import VocabularyForm from '../components/VocabularyForm';
import { BookOpenIcon, ArrowPathIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import withAuth from '../components/withAuth';
import { useSession } from 'next-auth/react';

function VocabularyPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    fetchVocabulary();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = entries.filter(
        entry => 
          entry.french.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (entry.example && entry.example.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (entry.notes && entry.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (entry.category && entry.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries);
    }
  }, [entries, searchTerm]);

  const fetchVocabulary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/vocabulary');
      if (!response.ok) {
        throw new Error('Failed to fetch vocabulary');
      }
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Failed to fetch vocabulary:', error);
      setError('Failed to load vocabulary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (entry: any) => {
    try {
      const isEditing = Boolean(entry._id);
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch('/api/vocabulary', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save vocabulary');
      }
      
      const savedEntry = await response.json();
      
      if (isEditing) {
        setEntries(entries.map(e => e._id === savedEntry._id ? savedEntry : e));
      } else {
        setEntries([savedEntry, ...entries]);
      }
      
      setIsFormVisible(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error saving vocabulary:', error);
      setError('Failed to save. Please try again.');
    }
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/vocabulary?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete vocabulary');
      }
      
      setEntries(entries.filter(entry => entry._id !== id));
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      setError('Failed to delete. Please try again.');
    }
  };

  const handleAddClick = () => {
    setEditingEntry(null);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingEntry(null);
  };

  // Get unique categories from entries for the sidebar
  const categories = Array.from(new Set(entries.map(entry => entry.category || 'Uncategorized')));

  return (
    <div className="page-container">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex items-center">
              <BookOpenIcon className="h-8 w-8 text-blue-600 mr-2" />
              <span>My Vocabulary</span>
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-3xl">
              Build and review your personal French vocabulary collection.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={fetchVocabulary}
              className="btn btn-ghost"
              aria-label="Refresh vocabulary"
              disabled={isLoading}
            >
              <ArrowPathIcon className={`h-5 w-5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-medium">Dismiss</button>
        </div>
      )}

      {isFormVisible && (
        <div className="card p-6 mb-8 animate-slide-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingEntry ? 'Edit Vocabulary' : 'Add New Vocabulary'}
            </h2>
            <button 
              onClick={handleFormCancel}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close form"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <VocabularyForm 
            onSubmit={handleSubmit} 
            initialData={editingEntry}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24 space-y-6">
            <div className="card p-6 bg-gradient-to-br from-blue-50 to-white">
              <div className="flex items-start">
                <InformationCircleIcon className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-blue-900 mb-2">About This Collection</h2>
                  <p className="text-sm text-gray-600">
                    This collection features your personal French vocabulary for your language learning journey. 
                    From basic expressions to advanced concepts, these words provide a strong foundation.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Vocabulary Categories</h2>
              <ul className="space-y-2 text-sm">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <li key={category} className="flex items-center text-blue-700">
                      <span className="h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                      {category}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No categories yet</li>
                )}
              </ul>
            </div>
            
            <div className="card p-6 bg-yellow-50 border-yellow-200">
              <h2 className="text-lg font-medium text-yellow-800 mb-3">Study Tips</h2>
              <ul className="space-y-3 text-sm text-yellow-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Practice regularly with the flashcard feature</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  <span>Speak words aloud when studying</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Try creating sentences with new words</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Track your progress with review sessions</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="lg:col-span-2 order-1 lg:order-2">
          <div className="card">
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-t-lg border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
                  Vocabulary List ({filteredEntries.length})
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search vocabulary..."
                    className="form-input pl-10 py-2 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {!isFormVisible && (
                <button
                  onClick={handleAddClick}
                  className="w-full mb-6 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  + Add New Vocabulary
                </button>
              )}
              
              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading vocabulary...</p>
                </div>
              ) : filteredEntries.length > 0 ? (
                <VocabularyList 
                  entries={filteredEntries} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500">
                    {searchTerm 
                      ? 'No vocabulary entries match your search.' 
                      : 'No vocabulary entries yet. Add your first word!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default withAuth(VocabularyPage);