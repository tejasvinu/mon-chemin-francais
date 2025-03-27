'use client';

import { useEffect, useState } from 'react';
import { Story } from '../types';
import { BookOpenIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStories();
  }, [activeLevel]);

  const fetchStories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = activeLevel 
        ? `/api/stories?level=${activeLevel}` 
        : '/api/stories';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const data = await response.json();
      setStories(data.stories || []);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      setError('Failed to load stories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter stories based on search term
  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group stories by level for easier display
  const storiesByLevel = filteredStories.reduce<Record<string, Story[]>>((acc, story) => {
    if (!acc[story.level]) {
      acc[story.level] = [];
    }
    acc[story.level].push(story);
    return acc;
  }, {});

  return (
    <div className="page-container">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex items-center">
              <BookOpenIcon className="h-8 w-8 text-blue-600 mr-2" />
              <span>Graded Reading</span>
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-3xl">
              Improve your French reading comprehension with stories tailored to your level.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={fetchStories}
              className="btn btn-ghost"
              aria-label="Refresh stories"
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

      {/* Level filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveLevel(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeLevel === null
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All Levels
          </button>
          {LEVELS.map(level => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeLevel === level
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search stories..."
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

      {/* Stories list */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading stories...</p>
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            {searchTerm
              ? 'No stories match your search.'
              : activeLevel
                ? `No stories available for level ${activeLevel} yet.`
                : 'No stories available yet.'}
          </p>
        </div>
      ) : (
        <>
          {/* Display by level if not filtered by level already */}
          {activeLevel === null ? (
            Object.entries(storiesByLevel).map(([level, levelStories]) => (
              <div key={level} className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Level {level}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {levelStories.map(story => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map(story => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/stories/${story.id}`} className="group">
      <div className="card h-full transition-all hover:-translate-y-1 hover:shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-blue-900 group-hover:text-blue-700">
              {story.title}
            </h3>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {story.level}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {story.content.substring(0, 150)}...
          </p>
          
          <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
            Read story
            <svg className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}