'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookOpenIcon, ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import withAuth from '../components/withAuth';

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

function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stories');
      if (!response.ok) throw new Error('Failed to fetch stories');
      const data = await response.json();
      setStories(data.stories || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      {/* Abstract background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <defs>
            <radialGradient id="stories-bg-grad-1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0.05)" /> {/* purple-500 with low opacity */}
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
            </radialGradient>
            <radialGradient id="stories-bg-grad-2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(217, 70, 239, 0.05)" /> {/* fuchsia-500 with low opacity */}
              <stop offset="100%" stopColor="rgba(217, 70, 239, 0)" />
            </radialGradient>
          </defs>
          <pattern id="stories-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 85, 247, 0.1)" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#stories-grid)" />
          <circle cx="10%" cy="80%" r="200" fill="url(#stories-bg-grad-1)" className="animate-float-slow opacity-60" />
          <circle cx="90%" cy="20%" r="250" fill="url(#stories-bg-grad-2)" className="animate-float-medium opacity-50" />
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
                  <BookOpenIcon className="h-7 w-7 sm:h-8 lg:h-10 text-purple-600 mr-2.5 sm:mr-3 lg:mr-4 flex-shrink-0" />
                  <span className="truncate">Les Histoires</span>
                </h1>
                <p className="mt-1.5 sm:mt-2 text-sm sm:text-base lg:text-lg text-gray-600">
                  Immerse yourself in captivating French stories for learners.
                </p>
              </div>
              <div className="flex-shrink-0 mt-3 sm:mt-0">
                <button
                  onClick={fetchStories}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md transition-all duration-150 disabled:opacity-60"
                  disabled={isLoading}
                >
                  <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Loading...' : 'Refresh Stories'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search stories by title or keywords..."
              className="block w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Stories Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants} // Stagger children within the grid
        >
          {isLoading ? (
            // Loading skeleton (optional, or simple spinner)
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div 
                key={`skeleton-${index}`}
                variants={itemVariants} // Each skeleton item also animates in
                className="backdrop-blur-sm bg-white/60 rounded-xl sm:rounded-2xl shadow-lg border border-white/30 p-5 sm:p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1.5"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                  </div>
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                </div>
              </motion.div>
            ))
          ) : filteredStories.length > 0 ? (
            filteredStories.map((story) => (
              <motion.div
                key={story.id}
                variants={itemVariants} // Each story card animates in
                className="group relative flex flex-col h-full"
              >
                <Link href={`/stories/${story.id || story._id}`} className="flex flex-col flex-grow">
                  <div className="flex-grow backdrop-blur-sm bg-white/80 rounded-xl sm:rounded-2xl shadow-lg border border-white/30 p-5 sm:p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                    {/* Optional: subtle gradient overlay on hover */}
                    <div className="absolute -inset-px bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-purple-700 transition-colors">{story.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-4">{story.description}</p>
                    </div>
                    
                    <div className="relative z-10 mt-auto pt-3 border-t border-purple-100/50">
                      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 text-2xs sm:text-xs">
                        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap gap-y-1">
                          <span className="px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
                            {story.level || 'All Levels'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-700">
                            {story.readTime || '~5 min read'}
                          </span>
                        </div>
                        <span className="font-semibold text-purple-600 group-hover:translate-x-1 transition-transform duration-300 flex items-center">
                          Read Story <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 sm:py-16">
              <BookOpenIcon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-purple-400" />
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">No Stories Found</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
                {searchTerm ? `No stories match "${searchTerm}". Try a different search.` : 'Check back later for new stories!'}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default withAuth(StoriesPage);