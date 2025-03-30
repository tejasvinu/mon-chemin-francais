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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-amber-50">
      {/* Abstract background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <pattern id="fun-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="orange" strokeWidth="0.5" opacity="0.1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#fun-grid)" />
          <circle cx="10%" cy="10%" r="50" fill="url(#fun-gradient)" className="animate-float-slow" />
          <circle cx="90%" cy="90%" r="70" fill="url(#accent-gradient)" className="animate-float-medium" />
        </svg>
        <svg className="absolute w-full h-64 top-0" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fun-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M0,32 C200,100 400,0 600,50 C800,100 1000,0 1200,32 L1200,0 L0,0 Z" fill="url(#fun-gradient)" />
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
                  <FaceSmileIcon className="h-12 w-12 text-orange-600 mr-4 flex-shrink-0" />
                  <span>Fun Stuff</span>
                </h1>
                <p className="mt-3 text-lg text-gray-600">
                  Discover playful French expressions and cultural tidbits.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={fetchFunStuff}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-md transition-all duration-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Fun Phrases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          ) : funPhrases.length > 0 ? (
            funPhrases.map((phrase: any) => (
              <motion.div
                key={phrase.id || `phrase-${phrase.phrase}`}
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 overflow-hidden"
              >
                <div className="relative p-6">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative">
                    <p className="text-lg font-semibold text-orange-900 mb-2">{phrase.phrase}</p>
                    <p className="text-gray-600 mb-4">{phrase.meaning}</p>
                    {phrase.literalTranslation && (
                      <motion.div
                        key={`literal-${phrase.id || phrase.phrase}`}
                        className="mb-4 text-sm text-gray-500 italic"
                      >
                        Literal: {phrase.literalTranslation}
                      </motion.div>
                    )}
                    {phrase.context && (
                      <motion.div
                        key={`context-${phrase.id || phrase.phrase}`}
                        className="bg-gradient-to-r from-amber-50 to-white p-3 rounded-lg border border-amber-100"
                      >
                        <p className="text-sm text-amber-800">{phrase.context}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20">
              <FaceSmileIcon className="mx-auto h-12 w-12 text-orange-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Fun Phrases Found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Check back later for some fun French expressions!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default withAuth(FunStuffPage);