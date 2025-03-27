'use client';

import { useState, useEffect } from 'react';
import { VocabularyEntry } from '../types';
import { ArrowPathIcon, CheckCircleIcon, XMarkIcon, FaceSmileIcon } from '@heroicons/react/24/outline';

interface FlashcardReviewProps {
  entries: VocabularyEntry[];
  onReviewComplete: (entryId: string, nextLevel: number, wasCorrect: boolean) => void;
}

const SRS_LEVELS = [
  { level: 0, days: 0, name: 'New' },
  { level: 1, days: 1, name: 'Learning' },
  { level: 2, days: 3, name: 'Learning' },
  { level: 3, days: 7, name: 'Review' },
  { level: 4, days: 14, name: 'Review' },
  { level: 5, days: 30, name: 'Mastered' },
  { level: 6, days: 60, name: 'Mastered' },
  { level: 7, days: 90, name: 'Mastered' },
];

export default function FlashcardReview({ entries, onReviewComplete }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reviewedCards, setReviewedCards] = useState(new Set<string>());
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  
  // Shuffle the due cards but prioritize lower SRS levels
  const dueEntries = [...entries].sort((a, b) => {
    // First sort by SRS level (lower levels first)
    const levelDiff = (a.srsLevel || 0) - (b.srsLevel || 0);
    if (levelDiff !== 0) return levelDiff;
    
    // Then sort by nextReview date (earlier dates first)
    if (a.nextReview && b.nextReview) {
      return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
    }
    
    return 0;
  });

  const currentCard = dueEntries[currentIndex];
  const hasCards = dueEntries.length > 0;
  const isComplete = currentIndex >= dueEntries.length;
  const progress = hasCards ? Math.round(((currentIndex) / dueEntries.length) * 100) : 100;

  // Clear feedback message after a delay
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const handleFlip = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    
    // Reset animation flag after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleResponse = (response: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard || isAnimating) return;
    
    let nextLevel = currentCard.srsLevel || 0;
    let wasCorrect = false;
    let message = '';
    
    switch (response) {
      case 'again':
        nextLevel = Math.max(0, nextLevel - 1);
        setFeedbackType('error');
        message = 'Card will be shown again soon';
        break;
      case 'hard':
        // Stay at current level
        setFeedbackType('info');
        message = 'You found this difficult';
        break;
      case 'good':
        nextLevel = nextLevel + 1;
        wasCorrect = true;
        setFeedbackType('success');
        message = 'Good job! Moving to next level';
        break;
      case 'easy':
        nextLevel = nextLevel + 2;
        wasCorrect = true;
        setFeedbackType('success');
        message = 'Perfect! Advancing two levels';
        break;
    }
    
    // Display feedback
    setFeedbackMessage(message);
    
    // Schedule next review
    onReviewComplete(currentCard.id, nextLevel, wasCorrect);
    setReviewedCards(prev => new Set(prev).add(currentCard.id));
    
    // Animate card exit
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      setIsAnimating(false);
    }, 400);
  };

  const getCardLevelInfo = (level: number = 0) => {
    const srsInfo = SRS_LEVELS[Math.min(level, SRS_LEVELS.length - 1)];
    return {
      name: srsInfo.name,
      days: srsInfo.days,
      color: level < 3 ? 'blue' : level < 5 ? 'green' : 'indigo'
    };
  };
  
  if (!hasCards || isComplete) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 mb-6">
          {!hasCards ? (
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ) : (
            <CheckCircleIcon className="h-10 w-10" />
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {!hasCards ? 'No cards due for review!' : 'Review complete!'}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {!hasCards 
            ? 'All caught up! Add new vocabulary or come back later when cards are due.'
            : `Excellent work! You've reviewed ${reviewedCards.size} card${reviewedCards.size === 1 ? '' : 's'} in this session.`
          }
        </p>
        
        {isComplete && reviewedCards.size > 0 && (
          <div className="mt-8">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setReviewedCards(new Set());
                setIsFlipped(false);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Study Again
            </button>
          </div>
        )}
      </div>
    );
  }

  // Level info for current card
  const levelInfo = getCardLevelInfo(currentCard.srsLevel);

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress bar and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 px-2">
        <div className="flex items-center mb-2 sm:mb-0">
          <div className="w-full sm:w-32 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">
            {currentIndex} / {dueEntries.length}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span 
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${levelInfo.color}-100 text-${levelInfo.color}-800`}
          >
            {levelInfo.name}
          </span>
          <span className="text-xs text-gray-500">
            {currentCard.lastReviewed ? 
              `Last reviewed: ${new Date(currentCard.lastReviewed).toLocaleDateString()}` : 
              'New card'}
          </span>
        </div>
      </div>
      
      {/* Feedback message */}
      {feedbackMessage && (
        <div 
          className={`mb-4 py-2 px-3 rounded-md text-sm animate-fade-in
            ${feedbackType === 'success' ? 'bg-green-50 text-green-800' : 
              feedbackType === 'error' ? 'bg-red-50 text-red-800' : 
              'bg-blue-50 text-blue-800'}`}
        >
          {feedbackMessage}
        </div>
      )}

      {/* Flashcard */}
      <div 
        className={`flashcard-container perspective-1000 w-full h-80 ${isAnimating ? 'pointer-events-none' : ''}`}
      >
        <div 
          className={`flashcard relative w-full h-full cursor-pointer transition-transform duration-300 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div className="absolute inset-0 backface-hidden rounded-xl shadow-lg bg-white border border-gray-200">
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <span className="text-sm text-gray-500 mb-6">French</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{currentCard.french}</h2>
              {currentCard.example && (
                <p className="mt-4 text-gray-600 italic text-sm max-w-xs mx-auto">
                  {currentCard.example}
                </p>
              )}
              <div className="absolute bottom-4 inset-x-0 text-center text-sm text-gray-400">
                Tap to flip
              </div>
            </div>
          </div>
          
          {/* Back of card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl shadow-lg bg-blue-50 border border-blue-200">
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <span className="text-sm text-gray-500 mb-6">English</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentCard.english}</h2>
              {currentCard.notes && (
                <p className="mt-2 text-gray-600 text-sm max-w-xs mx-auto">
                  {currentCard.notes}
                </p>
              )}
              <div className="absolute bottom-4 inset-x-0 text-center text-sm text-gray-400">
                Tap to flip back
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Answer buttons */}
      <div className={`mt-6 transition-opacity duration-300 ${isAnimating ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            onClick={() => handleResponse('again')}
            className="group relative py-3 px-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow transition-all duration-200 flex flex-col items-center justify-center"
          >
            <XMarkIcon className="h-5 w-5 mb-1" />
            <span className="font-medium">Again</span>
            <span className="text-xs text-red-100 transition-opacity">(&lt;1 day)</span>
          </button>
          
          <button
            onClick={() => handleResponse('hard')}
            className="group relative py-3 px-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow transition-all duration-200 flex flex-col items-center justify-center"
          >
            <svg className="h-5 w-5 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Hard</span>
            <span className="text-xs text-orange-100 transition-opacity">({SRS_LEVELS[Math.max(0, (currentCard.srsLevel || 0))].days} days)</span>
          </button>
          
          <button
            onClick={() => handleResponse('good')}
            className="group relative py-3 px-2 rounded-lg bg-green-500 hover:bg-green-600 text-white shadow transition-all duration-200 flex flex-col items-center justify-center"
          >
            <CheckCircleIcon className="h-5 w-5 mb-1" />
            <span className="font-medium">Good</span>
            <span className="text-xs text-green-100 transition-opacity">
              ({SRS_LEVELS[Math.min(SRS_LEVELS.length - 1, (currentCard.srsLevel || 0) + 1)].days} days)
            </span>
          </button>
          
          <button
            onClick={() => handleResponse('easy')}
            className="group relative py-3 px-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow transition-all duration-200 flex flex-col items-center justify-center"
          >
            <FaceSmileIcon className="h-5 w-5 mb-1" />
            <span className="font-medium">Easy</span>
            <span className="text-xs text-blue-100 transition-opacity">
              ({SRS_LEVELS[Math.min(SRS_LEVELS.length - 1, (currentCard.srsLevel || 0) + 2)].days} days)
            </span>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}