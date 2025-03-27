'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Story, VocabularyEntry } from '../../types';
import { ArrowLeftIcon, BookOpenIcon, TranslateIcon, CheckCircleIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function StoryDetailPage() {
  const { storyId } = useParams();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [checkedAnswers, setCheckedAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  const fetchStory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stories/${storyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch story');
      }
      const data = await response.json();
      setStory(data.story);
    } catch (error) {
      console.error('Failed to fetch story:', error);
      setError('Failed to load story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVocabularyClick = (word: string) => {
    // Placeholder for vocabulary definition lookup
    console.log(`Lookup for: ${word}`);
    // Could open a modal/tooltip showing definition
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleCheckAnswer = (questionIndex: number) => {
    if (story?.comprehensionQuestions && selectedAnswers[questionIndex] !== undefined) {
      const isCorrect = selectedAnswers[questionIndex] === 
        story.comprehensionQuestions[questionIndex].correctAnswerIndex;
      
      const newCheckedAnswers = [...checkedAnswers];
      newCheckedAnswers[questionIndex] = isCorrect;
      setCheckedAnswers(newCheckedAnswers);
    }
  };

  // Format paragraphs from story content
  const paragraphs = story?.content?.split('\n').filter(p => p.trim() !== '') || [];
  const translationParagraphs = story?.translation?.split('\n').filter(p => p.trim() !== '') || [];

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="page-container">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          {error || 'Story not found'}
          <button onClick={() => router.push('/stories')} className="ml-2 font-medium">
            Return to Stories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-5xl">
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/stories" className="text-blue-600 hover:text-blue-800 flex items-center mr-4">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Stories
          </Link>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {story.level}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex items-center">
          <BookOpenIcon className="h-8 w-8 text-blue-600 mr-2" />
          <span>{story.title}</span>
        </h1>
      </header>

      {/* Translation toggle */}
      <div className="mb-8">
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="flex items-center text-sm font-medium px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800"
        >
          <TranslateIcon className="h-4 w-4 mr-2" />
          {showTranslation ? 'Hide' : 'Show'} English Translation
        </button>
      </div>

      {/* Story content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-10">
        <div className="prose prose-blue max-w-none">
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="mb-6">
              <p className="text-gray-900 mb-2">
                {paragraph}
              </p>
              
              {/* Show translation if enabled */}
              {showTranslation && translationParagraphs[index] && (
                <p className="text-gray-600 italic text-sm pl-4 border-l-2 border-blue-200">
                  {translationParagraphs[index]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Comprehension questions */}
      {story.comprehensionQuestions && story.comprehensionQuestions.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Comprehension Questions</h2>
          
          <div className="space-y-6">
            {story.comprehensionQuestions.map((question, qIndex) => (
              <div key={qIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div 
                  className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                  onClick={() => setActiveQuestionIndex(activeQuestionIndex === qIndex ? null : qIndex)}
                >
                  <h3 className="font-medium text-gray-900">{question.question}</h3>
                  <button className="text-gray-500">
                    {activeQuestionIndex === qIndex ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {activeQuestionIndex === qIndex && (
                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center">
                          <input
                            type="radio"
                            id={`question-${qIndex}-option-${oIndex}`}
                            name={`question-${qIndex}`}
                            className="form-radio h-4 w-4 text-blue-600"
                            checked={selectedAnswers[qIndex] === oIndex}
                            onChange={() => handleAnswerSelect(qIndex, oIndex)}
                            disabled={checkedAnswers[qIndex] !== undefined}
                          />
                          <label
                            htmlFor={`question-${qIndex}-option-${oIndex}`}
                            className={`ml-3 text-sm text-gray-700 ${
                              checkedAnswers[qIndex] !== undefined &&
                              oIndex === question.correctAnswerIndex
                                ? 'font-bold text-green-700'
                                : ''
                            }`}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    {checkedAnswers[qIndex] === undefined ? (
                      <button
                        onClick={() => handleCheckAnswer(qIndex)}
                        disabled={selectedAnswers[qIndex] === undefined}
                        className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <div className={`flex items-center ${
                        checkedAnswers[qIndex] ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {checkedAnswers[qIndex] ? (
                          <>
                            <CheckCircleIcon className="h-5 w-5 mr-1" />
                            <span>Correct!</span>
                          </>
                        ) : (
                          <>
                            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>
                              Incorrect. The correct answer is: {question.options[question.correctAnswerIndex]}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vocabulary highlights */}
      {story.vocabularyHighlights && story.vocabularyHighlights.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Vocabulary</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {story.vocabularyHighlights.map((vocab: VocabularyEntry) => (
                <li key={vocab.id} className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">{vocab.french}</span>
                    <span className="text-gray-700">{vocab.english}</span>
                  </div>
                  {vocab.example && (
                    <span className="text-sm text-gray-600 italic mt-1">{vocab.example}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}