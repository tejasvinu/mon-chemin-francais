'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SpeakerWaveIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FlashcardReviewProps {
  flashcard: any;
  onAnswer: (correct: boolean) => void;
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
}

export default function FlashcardReview({
  flashcard,
  onAnswer,
  showAnswer,
  setShowAnswer
}: FlashcardReviewProps) {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    if (!showAnswer) {
      setIsFlipping(true);
      setShowAnswer(true);
      setTimeout(() => setIsFlipping(false), 300);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onClick={handleFlip}
        className={`relative aspect-[3/2] perspective-1000 cursor-pointer ${isFlipping ? 'animate-flip' : ''}`}
      >
        {/* Card Front */}
        <div className={`absolute inset-0 ${showAnswer ? 'hidden' : 'block'}`}>
          <div className="h-full backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 p-8 flex flex-col items-center justify-center text-center transform transition-transform duration-300 hover:scale-[1.02]">
            <div className="absolute top-4 right-4">
              <button
                className="p-2 text-indigo-500 hover:text-indigo-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add audio playback logic here
                }}
              >
                <SpeakerWaveIcon className="h-6 w-6" />
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{flashcard.french}</h2>
            <p className="text-gray-600">Click to reveal translation</p>
          </div>
        </div>

        {/* Card Back */}
        <div className={`absolute inset-0 ${showAnswer ? 'block' : 'hidden'}`}>
          <div className="h-full backdrop-blur-sm bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-lg border border-white/20 p-8 flex flex-col items-center justify-between text-center">
            <div className="flex-grow flex flex-col items-center justify-center">
              <p className="text-gray-600 mb-2">Translation</p>
              <h3 className="text-2xl font-bold text-gray-900">{flashcard.english}</h3>
              {flashcard.example && (
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-1">Example:</p>
                  <p className="text-indigo-700 font-medium">{flashcard.example}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAnswer(false)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-md transition-all duration-300"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Incorrect
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAnswer(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md transition-all duration-300"
              >
                <CheckIcon className="h-5 w-5 mr-2" />
                Correct
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info (only shown when answer is revealed) */}
      {showAnswer && flashcard.notes && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 backdrop-blur-sm bg-white/80 rounded-xl shadow-md border border-white/20 p-6"
        >
          <h4 className="text-sm font-medium text-indigo-900 mb-2">Additional Notes:</h4>
          <p className="text-gray-600">{flashcard.notes}</p>
        </motion.div>
      )}
    </div>
  )
}