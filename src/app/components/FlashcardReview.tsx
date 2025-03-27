'use client';

import { useState } from 'react';
import { VocabularyEntry } from '../types';

interface FlashcardReviewProps {
  entries: VocabularyEntry[];
  onReviewComplete: (entryId: string, nextLevel: number) => void;
}

const SRS_INTERVALS = [
  { level: 0, days: 0 },    // New card
  { level: 1, days: 1 },    // Review next day
  { level: 2, days: 3 },    // Review in 3 days
  { level: 3, days: 7 },    // Review in a week
  { level: 4, days: 14 },   // Review in 2 weeks
];

export default function FlashcardReview({ entries, onReviewComplete }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [reviewedCards, setReviewedCards] = useState(new Set<string>());

  const dueEntries = entries.filter(entry => {
    if (!entry.nextReview) return true;
    return new Date(entry.nextReview) <= new Date();
  }).sort((a, b) => (a.srsLevel || 0) - (b.srsLevel || 0));

  const currentCard = dueEntries[currentIndex];
  const hasCards = dueEntries.length > 0;
  const isComplete = currentIndex >= dueEntries.length;

  const handleReveal = () => setIsRevealed(true);

  const handleResponse = (response: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    let nextLevel = currentCard.srsLevel;
    switch (response) {
      case 'again':
        nextLevel = Math.max(0, nextLevel - 1);
        break;
      case 'hard':
        // Stay at current level
        break;
      case 'good':
        nextLevel = Math.min(4, nextLevel + 1);
        break;
      case 'easy':
        nextLevel = Math.min(4, nextLevel + 2);
        break;
    }

    onReviewComplete(currentCard.id, nextLevel);
    setReviewedCards(prev => new Set(prev).add(currentCard.id));
    setCurrentIndex(prev => prev + 1);
    setIsRevealed(false);
  };

  if (!hasCards || isComplete) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
          {!hasCards ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {!hasCards ? 'No cards due for review!' : 'Review complete!'}
        </h3>
        <p className="mt-2 text-md text-gray-600 max-w-md mx-auto">
          {!hasCards 
            ? 'Add some vocabulary or wait for cards to become due for review.'
            : `Congratulations! You've reviewed ${reviewedCards.size} card${reviewedCards.size === 1 ? '' : 's'} today.`
          }
        </p>
        
        {isComplete && reviewedCards.size > 0 && (
          <div className="mt-6">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setReviewedCards(new Set());
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start Another Review
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-3 px-2">
        <span>Card {currentIndex + 1} of {dueEntries.length}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
          Level: {currentCard.srsLevel}
        </span>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className={`p-8 transition-all duration-300 ${isRevealed ? 'bg-blue-50' : 'bg-white'}`}>
          <div 
            className={`min-h-[200px] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-300 ${isRevealed ? 'opacity-100' : 'hover:opacity-80'}`}
            onClick={!isRevealed ? handleReveal : undefined}
          >
            <div className="text-center">
              <div className="text-3xl font-bold mb-6">
                {currentCard.french}
              </div>
              
              {isRevealed && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-xl text-gray-700">
                    {currentCard.english}
                  </div>
                  {currentCard.example && (
                    <div className="text-md text-gray-600 italic border-l-4 border-blue-200 pl-3">
                      {currentCard.example}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {!isRevealed ? (
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={handleReveal}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
              Show Answer
            </button>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button
                onClick={() => handleResponse('again')}
                className="px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex flex-col items-center"
              >
                <span>Again</span>
                <span className="text-xs opacity-75">(&lt; 1d)</span>
              </button>
              <button
                onClick={() => handleResponse('hard')}
                className="px-4 py-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors flex flex-col items-center"
              >
                <span>Hard</span>
                <span className="text-xs opacity-75">(1d)</span>
              </button>
              <button
                onClick={() => handleResponse('good')}
                className="px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex flex-col items-center"
              >
                <span>Good</span>
                <span className="text-xs opacity-75">(3d)</span>
              </button>
              <button
                onClick={() => handleResponse('easy')}
                className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex flex-col items-center"
              >
                <span>Easy</span>
                <span className="text-xs opacity-75">(7d+)</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}