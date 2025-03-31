'use client';

import { useState, useEffect, use } from 'react';
import { ArrowLeftIcon, BookOpenIcon, SpeakerWaveIcon, DocumentTextIcon, AcademicCapIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Link from 'next/link';
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

function StoryPage({ params }: { params: { storyId: string } | Promise<{ storyId: string }> }) {
  // Unwrap params if it's a Promise using React's use() hook
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const { storyId } = resolvedParams;
  
  const [story, setStory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: number}>({});
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    async function fetchStory() {
      if (!storyId || storyId === 'undefined') {
        console.error('Missing or invalid story ID:', storyId);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/stories/${storyId}`);
        if (!response.ok) throw new Error('Failed to fetch story');
        const data = await response.json();
        setStory(data.story);
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStory();
  }, [storyId]);

  // Function to parse content into paragraphs
  const getParagraphs = () => {
    if (!story) return [];
    
    // If paragraphs are already structured
    if (story.paragraphs && Array.isArray(story.paragraphs)) {
      return story.paragraphs;
    }
    
    // If content is available but not structured into paragraphs
    if (story.content) {
      // Split by newlines
      const contentLines = story.content.split('\n');
      const translationLines = story.translation ? story.translation.split('\n') : [];
      
      // Map each line to a paragraph object
      const contentParagraphs = contentLines.map((text, i) => ({
        french: text.trim(),
        english: translationLines[i] ? translationLines[i].trim() : ''
      })).filter(p => p.french); // Remove empty paragraphs
      
      return contentParagraphs;
    }
    
    return [];
  };

  // Handle selecting an answer in the comprehension questions
  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  // Check if answer is correct
  const isCorrectAnswer = (questionIndex: number, answerIndex: number) => {
    if (!showAnswers || !story?.comprehensionQuestions) return false;
    const question = story.comprehensionQuestions[questionIndex];
    return question.correctAnswerIndex === answerIndex;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Abstract background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <pattern id="story-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="purple" strokeWidth="0.5" opacity="0.1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#story-grid)" />
          <circle cx="10%" cy="10%" r="50" fill="url(#story-gradient)" className="animate-float-slow" />
          <circle cx="90%" cy="90%" r="70" fill="url(#accent-gradient)" className="animate-float-medium" />
        </svg>
        <svg className="absolute w-full h-64 top-0" preserveAspectRatio="none">
          <defs>
            <linearGradient id="story-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M0,32 C200,100 400,0 600,50 C800,100 1000,0 1200,32 L1200,0 L0,0 Z" fill="url(#story-gradient)" />
        </svg>
      </div>

      <motion.div
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back button */}
        <motion.div variants={itemVariants} className="mb-8">
          <Link
            href="/stories"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Stories
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : story ? (
          <>
            {/* Story Header */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="relative backdrop-blur-sm bg-white/70 rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="flex items-start">
                  <BookOpenIcon className="h-12 w-12 text-purple-600 mr-4 flex-shrink-0" />
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">{story.title}</h1>
                    <p className="mt-3 text-lg text-gray-600">{story.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {story.level || 'All Levels'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {story.readTime || '5 min read'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Translation Toggle */}
            <motion.div variants={itemVariants} className="mb-8">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                {showTranslation ? 'Hide' : 'Show'} Translation
              </button>
            </motion.div>

            {/* Story Content */}
            <motion.div variants={itemVariants}>
              <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 p-8">
                <div className="prose prose-lg max-w-none">
                  {getParagraphs().map((paragraph: any, index: number) => (
                    <motion.div
                      key={`paragraph-${story.id || index}-${index}`}
                      className="mb-8"
                    >
                      <div className="relative group">
                        <p className="text-gray-900 leading-relaxed mb-2">{paragraph.french}</p>
                        <button
                          className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Listen"
                        >
                          <SpeakerWaveIcon className="h-5 w-5 text-purple-500 hover:text-purple-600" />
                        </button>
                      </div>
                      {showTranslation && paragraph.english && (
                        <p className="text-gray-600 italic">{paragraph.english}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Vocabulary Section - Compact format */}
            {story.vocabulary && Array.isArray(story.vocabulary) && story.vocabulary.length > 0 && (
              <motion.div variants={itemVariants} className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <BookmarkIcon className="h-6 w-6 mr-2 text-purple-600" />
                  Key Vocabulary
                </h2>
                <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {story.vocabulary.map((item: any, index: number) => (
                      <motion.div
                        key={`vocab-${story.id || index}-${index}`}
                        className="p-3 rounded-lg border border-purple-100 bg-white/70"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-medium text-purple-900">{item.french}</p>
                            <p className="text-sm text-gray-600">{item.english}</p>
                            {item.example && (
                              <p className="text-xs text-gray-500 mt-1 italic">"{item.example}"</p>
                            )}
                          </div>
                          <button
                            className="p-1.5 text-purple-500 hover:text-purple-600 transition-colors rounded-full hover:bg-purple-50"
                            title="Listen"
                          >
                            <SpeakerWaveIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Comprehension Questions */}
            {story.comprehensionQuestions && story.comprehensionQuestions.length > 0 && (
              <motion.div variants={itemVariants} className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <AcademicCapIcon className="h-6 w-6 mr-2 text-purple-600" />
                  Comprehension Questions
                </h2>
                <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 p-6">
                  <div className="space-y-8">
                    {story.comprehensionQuestions.map((question: any, qIndex: number) => (
                      <div key={`question-${qIndex}`} className="bg-white/50 rounded-lg p-5 shadow-sm">
                        <h3 className="text-lg font-medium mb-4">{qIndex + 1}. {question.question}</h3>
                        <div className="space-y-3">
                          {question.options.map((option: string, oIndex: number) => (
                            <div 
                              key={`option-${qIndex}-${oIndex}`}
                              className={`rounded-lg border p-3 cursor-pointer transition-colors ${
                                selectedAnswers[qIndex] === oIndex 
                                  ? 'border-purple-500 bg-purple-50' 
                                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
                              } ${
                                showAnswers && isCorrectAnswer(qIndex, oIndex)
                                  ? 'bg-green-50 border-green-500'
                                  : showAnswers && selectedAnswers[qIndex] === oIndex && !isCorrectAnswer(qIndex, oIndex)
                                    ? 'bg-red-50 border-red-500'
                                    : ''
                              }`}
                              onClick={() => handleSelectAnswer(qIndex, oIndex)}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setShowAnswers(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Check Answers
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-16 backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20"
          >
            <BookOpenIcon className="mx-auto h-12 w-12 text-purple-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Story Not Found</h3>
            <p className="mt-2 text-sm text-gray-500">
              This story might have been removed or is not available.
            </p>
            <Link
              href="/stories"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Browse Other Stories
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default withAuth(StoryPage);