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
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">
          {!hasCards ? 'No cards due for review!' : 'Review complete!'}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {!hasCards 
            ? 'Add some vocabulary or wait for cards to become due.'
            : `You've reviewed ${reviewedCards.size} cards.`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
        <div className="text-sm text-gray-600 mb-4">
          Card {currentIndex + 1} of {dueEntries.length}
        </div>
        
        <div 
          className="min-h-[200px] flex items-center justify-center cursor-pointer"
          onClick={!isRevealed ? handleReveal : undefined}
        >
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">
              {isRevealed ? currentCard.english : currentCard.french}
            </div>
            {isRevealed && (
              <>
                <div className="text-lg text-gray-700 mb-2">
                  {!isRevealed ? currentCard.english : currentCard.french}
                </div>
                {currentCard.example && (
                  <div className="text-sm text-gray-600 italic">
                    {currentCard.example}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {!isRevealed && (
          <div className="text-center mt-4">
            <button
              onClick={handleReveal}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Show Answer
            </button>
          </div>
        )}

        {isRevealed && (
          <div className="grid grid-cols-2 gap-2 mt-4 sm:grid-cols-4">
            <button
              onClick={() => handleResponse('again')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Again
            </button>
            <button
              onClick={() => handleResponse('hard')}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Hard
            </button>
            <button
              onClick={() => handleResponse('good')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Good
            </button>
            <button
              onClick={() => handleResponse('easy')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Easy
            </button>
          </div>
        )}
      </div>

      {currentCard.audioUrl && (
        <button
          onClick={() => new Audio(currentCard.audioUrl).play()}
          className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center"
        >
          🔊 Play Audio
        </button>
      )}
    </div>
  );
}