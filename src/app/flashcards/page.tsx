'use client';

import { useEffect, useState } from 'react';
import FlashcardReview from '../components/FlashcardReview';
import { VocabularyEntry } from '../types';

const calculateNextReview = (srsLevel: number) => {
  const intervals = [0, 1, 3, 7, 14]; // days for each level
  const days = intervals[srsLevel] || 1;
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString();
};

export default function FlashcardsPage() {
  const [entries, setEntries] = useState<VocabularyEntry[]>([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const response = await fetch('/api/vocabulary');
    const data = await response.json();
    setEntries(data.entries);
  };

  const handleReviewComplete = async (entryId: string, nextLevel: number) => {
    const nextReview = calculateNextReview(nextLevel);
    
    await fetch('/api/vocabulary', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: entryId,
        srsLevel: nextLevel,
        nextReview,
        lastReviewed: new Date().toISOString(),
      }),
    });

    fetchEntries();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Flashcard Review</h1>
      <FlashcardReview
        entries={entries}
        onReviewComplete={handleReviewComplete}
      />
    </div>
  );
}