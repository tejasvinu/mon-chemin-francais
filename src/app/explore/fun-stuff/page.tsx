'use client';

import { useState, useEffect } from 'react';
import { FaceSmileIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import withAuth from '../../components/withAuth';

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

const cardVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

function FunStuffPage() {
  const [funPhrases, setFunPhrases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFunStuff();
  }, []);

  const fetchFunStuff = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/funstuff');
      if (!response.ok) throw new Error('Failed to fetch fun phrases');
      const data = await response.json();
      setFunPhrases(data.phrases || []);
    } catch (error) {
      console.error('Error fetching fun phrases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-amber-50 p-4 sm:p-6 lg:p-8">
      {/* Abstract background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <defs>
            <radialGradient id="fun-bg-grad-1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(249, 115, 22, 0.05)" /> {/* orange-500 */}
              <stop offset="100%" stopColor="rgba(249, 115, 22, 0)" />
            </radialGradient>
            <radialGradient id="fun-bg-grad-2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(251, 191, 36, 0.05)" /> {/* amber-400 */}
              <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
            </radialGradient>
          </defs>
          <pattern id="fun-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(249, 115, 22, 0.1)" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#fun-grid)" />
          <circle cx="25%" cy="75%" r="200" fill="url(#fun-bg-grad-1)" className="animate-float-slow opacity-70" />
          <circle cx="75%" cy="25%" r="250" fill="url(#fun-bg-grad-2)" className="animate-float-medium opacity-60" />
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
                  <FaceSmileIcon className="h-7 w-7 sm:h-8 lg:h-10 text-orange-600 mr-2.5 sm:mr-3 lg:mr-4 flex-shrink-0" />
                  <span className="truncate">Fun Stuff</span>
                </h1>
                <p className="mt-1.5 sm:mt-2 text-sm sm:text-base lg:text-lg text-gray-600">
                  Discover playful French expressions and cultural tidbits.
                </p>
              </div>
              <div className="flex-shrink-0 mt-3 sm:mt-0">
                <button
                  onClick={fetchFunStuff}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-md transition-all duration-150 disabled:opacity-60"
                  disabled={isLoading}
                >
                  <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Loading...' : 'Refresh Phrases'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fun Phrases Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants} // Stagger children in grid
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div 
                key={`skeleton-fun-${index}`} 
                variants={itemVariants} // Each skeleton item also animates in
                className="backdrop-blur-sm bg-white/60 rounded-xl sm:rounded-2xl shadow-lg border border-white/30 p-5 sm:p-6 animate-pulse h-48 sm:h-56"
              >
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="h-10 bg-gray-100 rounded-lg"></div>
              </motion.div>
            ))
          ) : funPhrases.length > 0 ? (
            funPhrases.map((phrase: any) => (
              <motion.div
                key={phrase.id || `phrase-${phrase.phrase}`}
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                className="group backdrop-blur-sm bg-white/80 rounded-xl sm:rounded-2xl shadow-lg border border-white/30 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
              >
                {/* Optional: subtle gradient overlay on hover */}
                <div className="absolute -inset-px bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                
                <div className="relative p-5 sm:p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-orange-800 group-hover:text-orange-700 transition-colors mb-1.5 sm:mb-2">{phrase.phrase}</p>
                    <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">{phrase.meaning}</p>
                    {phrase.literalTranslation && (
                      <p className="text-xs sm:text-sm text-gray-500 italic mb-2 sm:mb-3">
                        Literal: "{phrase.literalTranslation}"
                      </p>
                    )}
                  </div>
                  {phrase.context && (
                    <div className="mt-auto pt-2 sm:pt-3 border-t border-orange-100/70">
                      <p className="text-2xs sm:text-xs text-orange-700 bg-orange-50/80 p-2 sm:p-2.5 rounded-md">Context: {phrase.context}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 sm:py-16 backdrop-blur-sm bg-white/70 rounded-xl sm:rounded-2xl shadow-lg border border-white/30">
              <FaceSmileIcon className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-orange-400" />
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">No Fun Phrases Found</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
                Looks like the fun is still brewing! Check back later.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default withAuth(FunStuffPage);