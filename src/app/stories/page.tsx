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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Abstract background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <pattern id="stories-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="purple" strokeWidth="0.5" opacity="0.1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#stories-grid)" />
          <circle cx="10%" cy="10%" r="50" fill="url(#stories-gradient)" className="animate-float-slow" />
          <circle cx="90%" cy="90%" r="70" fill="url(#accent-gradient)" className="animate-float-medium" />
        </svg>
        <svg className="absolute w-full h-64 top-0" preserveAspectRatio="none">
          <defs>
            <linearGradient id="stories-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M0,32 C200,100 400,0 600,50 C800,100 1000,0 1200,32 L1200,0 L0,0 Z" fill="url(#stories-gradient)" />
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
                  <BookOpenIcon className="h-12 w-12 text-purple-600 mr-4 flex-shrink-0" />
                  <span>Les Histoires</span>
                </h1>
                <p className="mt-3 text-lg text-gray-600">
                  Immerse yourself in captivating French stories crafted for learners.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={fetchStories}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md transition-all duration-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search stories..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl text-sm bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Stories Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : filteredStories.length > 0 ? (
            filteredStories.map((story) => (
              <motion.div
                key={story.id}
                variants={itemVariants}
                className="group relative"
              >
                <Link href={`/stories/${story.id}`}>
                  <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{story.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{story.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {story.level || 'All Levels'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {story.readTime || '5 min read'}
                          </span>
                        </div>
                        <span className="text-purple-600 group-hover:translate-x-1 transition-transform duration-300">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <BookOpenIcon className="mx-auto h-12 w-12 text-purple-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Stories Found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Check back later for new stories!'}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default withAuth(StoriesPage);