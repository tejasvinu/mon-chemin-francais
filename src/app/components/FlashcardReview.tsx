'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SpeakerWaveIcon, StopIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTTS } from './TTSProvider';

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
  const { speak, isLoading, isSpeaking, stop } = useTTS();

  const handleSpeak = (text: string, isEnglish: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stop();
    } else {
      speak(text, isEnglish);
    }
  };

  const handleFlip = () => {
    if (!showAnswer) {
      setIsFlipping(true);
      setShowAnswer(true);
      setTimeout(() => setIsFlipping(false), 300);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        onClick={handleFlip}
        className={`relative aspect-[3/2] sm:aspect-video lg:aspect-[3/2] perspective-1000 cursor-pointer ${isFlipping ? 'animate-flip' : ''}`}
      >
        {/* Card Front */}
        <div className={`absolute inset-0 ${showAnswer ? 'hidden' : 'block'}`}>
          <div className="h-full backdrop-blur-sm bg-white/80 rounded-lg sm:rounded-xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center text-center transform transition-transform duration-300 hover:scale-[1.02]">
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
              <button
                className="p-1.5 sm:p-2 text-indigo-500 hover:text-indigo-600 transition-colors disabled:opacity-50 rounded-full hover:bg-indigo-100/50"
                onClick={(e) => handleSpeak(flashcard.french, false, e)}
                disabled={isLoading}
                title={isSpeaking ? "Stop" : "Listen in French"}
              >
                {isSpeaking ? (
                  <StopIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <SpeakerWaveIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">{flashcard.french}</h2>
            <p className="text-xs sm:text-sm text-gray-600">Click to reveal translation</p>
          </div>
        </div>

        {/* Card Back */}
        <div className={`absolute inset-0 ${showAnswer ? 'block' : 'hidden'}`}>
          <div className="h-full backdrop-blur-sm bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-lg sm:rounded-xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-between text-center">
            <div className="flex-grow flex flex-col items-center justify-center w-full">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <p className="text-xs sm:text-sm text-gray-600">Translation</p>
                <button
                  className="p-1 sm:p-1.5 text-indigo-500 hover:text-indigo-600 transition-colors disabled:opacity-50 rounded-full hover:bg-indigo-100/50"
                  onClick={(e) => handleSpeak(flashcard.english, true, e)}
                  disabled={isLoading}
                  title={isSpeaking ? "Stop" : "Listen in English"}
                >
                  {isSpeaking ? (
                    <StopIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <SpeakerWaveIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 px-2">{flashcard.english}</h3>
              {flashcard.example && (
                <div className="mt-3 sm:mt-4 lg:mt-6 w-full px-2">
                  <p className="text-2xs sm:text-xs text-gray-600 mb-0.5 sm:mb-1">Example:</p>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 bg-indigo-50/70 p-2 sm:p-2.5 rounded-md">
                    <p className="text-xs sm:text-sm text-indigo-700 font-medium">{flashcard.example}</p>
                    <button
                      className="p-1 sm:p-1.5 text-indigo-500 hover:text-indigo-600 transition-colors disabled:opacity-50 rounded-full hover:bg-indigo-100/50 flex-shrink-0"
                      onClick={(e) => handleSpeak(flashcard.example, false, e)}
                      disabled={isLoading}
                      title={isSpeaking ? "Stop" : "Listen to example"}
                    >
                      {isSpeaking ? (
                        <StopIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <SpeakerWaveIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAnswer(false)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 border border-transparent text-sm sm:text-base font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-md transition-all duration-150"
              >
                <XMarkIcon className="h-5 w-5 mr-1.5 sm:mr-2" />
                Incorrect
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAnswer(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 border border-transparent text-sm sm:text-base font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md transition-all duration-150"
              >
                <CheckIcon className="h-5 w-5 mr-1.5 sm:mr-2" />
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
          className="mt-4 sm:mt-6 backdrop-blur-sm bg-white/80 rounded-lg sm:rounded-xl shadow-md border border-white/20 p-3 sm:p-4 lg:p-6"
        >
          <h4 className="text-xs sm:text-sm font-semibold text-indigo-900 mb-1.5 sm:mb-2">Additional Notes:</h4>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{flashcard.notes}</p>
        </motion.div>
      )}
    </div>
  );
}