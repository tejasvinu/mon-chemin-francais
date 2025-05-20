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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-4 sm:p-6 lg:p-8">
      {/* Abstract background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <defs>
            <radialGradient id="flashcard-bg-grad-1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.05)" /> {/* indigo-500 with low opacity */}
              <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
            </radialGradient>
            <radialGradient id="flashcard-bg-grad-2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.05)" /> {/* purple-500 with low opacity */}
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
            </radialGradient>
          </defs>
          <pattern id="flashcards-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#flashcards-grid)" />
          <circle cx="15%" cy="20%" r="200" fill="url(#flashcard-bg-grad-1)" className="animate-float-slow opacity-70" />
          <circle cx="85%" cy="80%" r="250" fill="url(#flashcard-bg-grad-2)" className="animate-float-medium opacity-70" />
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
                  <SparklesIcon className="h-7 w-7 sm:h-8 lg:h-10 text-indigo-600 mr-2.5 sm:mr-3 lg:mr-4 flex-shrink-0" />
                  <span className="truncate">Mémoire Adaptive</span>
                </h1>
                <p className="mt-1.5 sm:mt-2 text-sm sm:text-base lg:text-lg text-gray-600">
                  Reinforce your learning through our intelligent flashcard system.
                </p>
              </div>
              <div className="flex-shrink-0 mt-3 sm:mt-0">
                <button
                  onClick={fetchFlashcards}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all duration-150 disabled:opacity-60"
                  disabled={isLoading}
                >
                  <ArrowPathIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Loading...' : 'Refresh Cards'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main content: Flashcards and Stats/Tips sidebar */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Main Flashcard Area (Order 1 on mobile, 2 on lg) */}
          <motion.div className="lg:col-span-3 lg:order-2 w-full" variants={itemVariants}>
            <div className="backdrop-blur-md bg-white/70 rounded-xl sm:rounded-2xl shadow-lg border border-white/30 p-4 sm:p-6 lg:p-8 min-h-[300px] sm:min-h-[400px] flex flex-col justify-center items-center">
              {isLoading && flashcards.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-600">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
                  <p className="text-base sm:text-lg font-medium">Loading Flashcards...</p>
                </div>
              ) : !isLoading && flashcards.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                    <SparklesIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-indigo-400 mb-4" />
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">No Flashcards Available</h3>
                    <p className="mt-2 text-sm sm:text-base">Add some vocabulary to get started with flashcards.</p>
                    <button
                        onClick={fetchFlashcards} // Or link to vocabulary page
                        className="mt-6 inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-150 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <ArrowPathIcon className="h-5 w-5 mr-2" />
                        Try Refreshing
                    </button>
                </div>
              ) : flashcards.length > 0 && currentIndex < flashcards.length ? (
                <FlashcardReview
                  flashcard={flashcards[currentIndex]}
                  onAnswer={handleAnswer}
                  showAnswer={showAnswer}
                  setShowAnswer={setShowAnswer}
                />
              ) : (
                <div className="text-center text-gray-600 py-8">
                  <CheckCircleIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-green-500 mb-4" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">Session Complete!</h3>
                  <p className="mt-2 text-sm sm:text-base">You've reviewed all available flashcards.</p>
                  <button
                    onClick={fetchFlashcards} // To restart or fetch new set
                    className="mt-6 inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-150 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <ArrowPathIcon className="h-5 w-5 mr-2" />
                    Start New Session
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar (Order 2 on mobile, 1 on lg) */}
          <div className="lg:col-span-1 lg:order-1 w-full lg:max-w-sm flex-shrink-0">
            <div className="space-y-6 sm:space-y-8">
              {/* Progress Stats */}
              <motion.div variants={itemVariants} className="backdrop-blur-md bg-white/70 rounded-xl sm:rounded-2xl shadow-lg border border-white/30 p-5 sm:p-6 lg:p-8">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Progress</h2>
                <div className="space-y-3 sm:space-y-4">
                  {(flashcards.length > 0 || stats.correct > 0 || stats.incorrect > 0) ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-xs sm:text-sm text-gray-600">Correct</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-green-600">{stats.correct}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                          <span className="text-xs sm:text-sm text-gray-600">Incorrect</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-red-600">{stats.incorrect}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Remaining</span>
                        <span className="text-xs sm:text-sm font-medium text-indigo-600">{stats.remaining}</span>
                      </div>
                      {(flashcards.length > 0) &&
                        <div className="relative pt-2 sm:pt-3">
                          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-indigo-100">
                            <div
                              style={{ width: `${flashcards.length > 0 ? ((stats.correct + stats.incorrect) / flashcards.length) * 100 : 0}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                            ></div>
                          </div>
                        </div>
                      }
                    </>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500 italic">Start a session to see your progress.</p>
                  )}
                </div>
              </motion.div>

              {/* Study Tips */}
              <motion.div variants={itemVariants} className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div> {/* Subtle glass effect on top of gradient */}
                <div className="relative p-5 sm:p-6 lg:p-8">
                  <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Study Tips</h2>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {[
                      "Review difficult cards more frequently.",
                      "Say answers out loud for better recall.",
                      "Create vivid mental associations.",
                      "Practice in both French-English and English-French directions."
                    ].map((tip, index) => (
                      <li key={index} className="flex items-start text-white/90">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-300 mr-2 sm:mr-2.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-2xs sm:text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default withAuth(FlashcardsPage);