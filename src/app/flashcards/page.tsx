'use client';

import { useEffect, useState } from 'react';
import FlashcardReview from '../components/FlashcardReview';
import { VocabularyEntry } from '../types';
import { AcademicCapIcon, ClockIcon, CheckCircleIcon, ArrowPathIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const calculateNextReview = (srsLevel: number) => {
  const intervals = [0, 1, 3, 7, 14, 30, 60, 90]; // days for each level
  const days = intervals[Math.min(srsLevel, intervals.length - 1)];
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString();
};

export default function FlashcardsPage() {
  const [entries, setEntries] = useState<VocabularyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState({
    dueCount: 0,
    masteredCount: 0,
    totalCount: 0,
    reviewedToday: 0
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/vocabulary');
      const data = await response.json();
      setEntries(data.entries);
      
      // Calculate stats
      const today = new Date().setHours(0, 0, 0, 0);
      const stats = {
        dueCount: data.entries.filter((e: VocabularyEntry) => 
          !e.nextReview || new Date(e.nextReview).getTime() <= Date.now()
        ).length,
        masteredCount: data.entries.filter((e: VocabularyEntry) => 
          e.srsLevel && e.srsLevel >= 5
        ).length,
        totalCount: data.entries.length,
        reviewedToday: data.entries.filter((e: VocabularyEntry) => 
          e.lastReviewed && new Date(e.lastReviewed).setHours(0, 0, 0, 0) === today
        ).length
      };
      setReviewStats(stats);
    } catch (error) {
      console.error('Failed to fetch flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewComplete = async (entryId: string, nextLevel: number, wasCorrect: boolean) => {
    // In the read-only version, we only update the local state for the current session
    // but don't make API calls to persist the changes
    try {
      const updatedEntries = entries.map(entry => {
        if (entry.id === entryId) {
          return {
            ...entry,
            srsLevel: nextLevel,
            nextReview: calculateNextReview(nextLevel),
            lastReviewed: new Date().toISOString()
          };
        }
        return entry;
      });
      
      setEntries(updatedEntries);
  
      // Update local stats for immediate feedback
      setReviewStats(prev => ({
        ...prev,
        reviewedToday: prev.reviewedToday + 1,
        dueCount: Math.max(0, prev.dueCount - 1),
        masteredCount: wasCorrect && nextLevel >= 5 ? 
          prev.masteredCount + 1 : prev.masteredCount
      }));

      console.log(`Review completed for ${entryId} - next level: ${nextLevel}`);
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };

  // Filter entries based on selected category (assuming we derive categories from our entries)
  const categories = Array.from(new Set(entries.map(entry => entry.category || 'Uncategorized')));

  const filteredEntries = selectedCategory 
    ? entries.filter(entry => entry.category === selectedCategory)
    : entries;

  const dueEntries = filteredEntries.filter(entry => 
    !entry.nextReview || new Date(entry.nextReview).getTime() <= Date.now()
  );

  return (
    <div className="page-container">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600 mr-2" />
              <span>Flashcard Review</span>
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-3xl">
              Review your vocabulary with spaced repetition to maximize retention.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={fetchEntries}
              className="btn btn-ghost"
              aria-label="Refresh flashcards"
              disabled={isLoading}
            >
              <ArrowPathIcon className={`h-5 w-5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar with stats */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Review Statistics</h2>
              </div>
              <div className="p-6">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="flex justify-between items-center px-4 py-4 bg-blue-50 rounded-lg overflow-hidden">
                    <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
                      <ClockIcon className="h-5 w-5 mr-2 text-blue-500" />
                      Cards Due Today
                    </dt>
                    <dd className="ml-2 text-xl font-semibold text-blue-700">{reviewStats.dueCount}</dd>
                  </div>
                  
                  <div className="flex justify-between items-center px-4 py-4 bg-green-50 rounded-lg overflow-hidden">
                    <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
                      <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                      Mastered Cards
                    </dt>
                    <dd className="ml-2 text-xl font-semibold text-green-700">
                      {reviewStats.masteredCount}
                    </dd>
                  </div>
                  
                  <div className="flex justify-between items-center px-4 py-4 bg-gray-50 rounded-lg overflow-hidden">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Cards
                    </dt>
                    <dd className="ml-2 text-xl font-semibold text-gray-700">
                      {reviewStats.totalCount}
                    </dd>
                  </div>
                  
                  <div className="flex justify-between items-center px-4 py-4 bg-gray-50 rounded-lg overflow-hidden">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Reviewed Today
                    </dt>
                    <dd className="ml-2 text-xl font-semibold text-gray-700">
                      {reviewStats.reviewedToday}
                    </dd>
                  </div>
                </dl>

                {/* Progress bar */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700">Mastery Progress</h3>
                  <div className="mt-2 relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                      <div 
                        style={{ width: `${reviewStats.totalCount ? (reviewStats.masteredCount / reviewStats.totalCount) * 100 : 0}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                      ></div>
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {reviewStats.totalCount ? Math.round((reviewStats.masteredCount / reviewStats.totalCount) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category filter */}
                {categories.length > 0 && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Category</h3>
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`block w-full text-left px-2 py-1 text-sm rounded ${
                          selectedCategory === null ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`block w-full text-left px-2 py-1 text-sm rounded ${
                            selectedCategory === category ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Read-Only Mode</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You're using the demo version of this app. Your review progress will be tracked during this session but won't be saved permanently.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tips */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Study Tips</h3>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>Review cards daily for best results</li>
                <li>Be honest with your self-assessment</li>
                <li>Speak the words aloud when practicing</li>
                <li>Create sentences with new vocabulary</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Flashcard review area */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 min-h-[500px] flex flex-col">
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Review Cards {dueEntries.length > 0 && <span className="text-blue-600">({dueEntries.length} due)</span>}
              </h2>
            </div>
            
            <div className="p-6 flex-grow flex flex-col justify-center">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading flashcards...</p>
                </div>
              ) : (
                <FlashcardReview
                  entries={dueEntries}
                  onReviewComplete={handleReviewComplete}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}