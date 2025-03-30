'use client';

import { useState, useEffect, useCallback } from 'react';
import { SparklesIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import withAuth from '../components/withAuth';
import FlashcardReview from '../components/FlashcardReview';

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

function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    remaining: 0
  });

  const fetchFlashcards = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/vocabulary');
      if (!response.ok) throw new Error('Failed to fetch flashcards');
      const data = await response.json();
      const cards = data.entries || [];
      setFlashcards(cards);
      setStats(prev => ({ ...prev, remaining: cards.length }));
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  const handleAnswer = (isCorrect: boolean) => {
    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      remaining: prev.remaining - 1
    }));
    setShowAnswer(false);
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Abstract background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <pattern id="flashcards-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="indigo" strokeWidth="0.5" opacity="0.1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#flashcards-grid)" />
          <circle cx="10%" cy="10%" r="50" fill="url(#flashcard-gradient)" className="animate-float-slow" />
          <circle cx="90%" cy="90%" r="70" fill="url(#accent-gradient)" className="animate-float-medium" />
        </svg>
        <svg className="absolute w-full h-64 top-0" preserveAspectRatio="none">
          <defs>
            <linearGradient id="flashcard-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M0,32 C200,100 400,0 600,50 C800,100 1000,0 1200,32 L1200,0 L0,0 Z" fill="url(#flashcard-gradient)" />
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
                  <SparklesIcon className="h-12 w-12 text-indigo-600 mr-4 flex-shrink-0" />
                  <span>Mémoire Adaptive</span>
                </h1>
                <p className="mt-3 text-lg text-gray-600">
                  Reinforce your learning through our intelligent flashcard system.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={fetchFlashcards}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all duration-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Progress Stats */}
              <motion.div variants={itemVariants} className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 p-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Progress</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Correct</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">{stats.correct}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-sm text-gray-600">Incorrect</span>
                    </div>
                    <span className="text-sm font-medium text-red-600">{stats.incorrect}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="text-sm font-medium text-indigo-600">{stats.remaining}</span>
                  </div>
                  <div className="relative pt-4">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-indigo-100">
                      <div
                        style={{ width: `${((stats.correct + stats.incorrect) / (flashcards.length || 1)) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-500"
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Study Tips */}
              <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700"></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative p-8">
                  <h2 className="text-lg font-semibold text-white mb-4">Study Tips</h2>
                  <ul className="space-y-3">
                    {[
                      "Review difficult cards more frequently",
                      "Say answers out loud",
                      "Create mental associations",
                      "Practice in both directions"
                    ].map((tip, index) => (
                      <li key={index} className="flex items-start text-white/90">
                        <svg className="h-5 w-5 text-indigo-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main content */}
          <motion.div className="lg:col-span-3" variants={itemVariants}>
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 p-8">
              {isLoading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
              ) : flashcards.length > 0 && currentIndex < flashcards.length ? (
                <FlashcardReview
                  flashcard={flashcards[currentIndex]}
                  onAnswer={handleAnswer}
                  showAnswer={showAnswer}
                  setShowAnswer={setShowAnswer}
                />
              ) : (
                <div className="text-center py-16">
                  <SparklesIcon className="mx-auto h-12 w-12 text-indigo-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Review Complete!</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    You've reviewed all the flashcards. Would you like to start over?
                  </p>
                  <button
                    onClick={() => {
                      setCurrentIndex(0);
                      setStats({ correct: 0, incorrect: 0, remaining: flashcards.length });
                    }}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default withAuth(FlashcardsPage);