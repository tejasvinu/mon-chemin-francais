'use client';

import { useEffect, useState } from 'react';
import { FunPhrase } from '../../types';
import { ArrowPathIcon, LightBulbIcon } from '@heroicons/react/24/outline';

export default function FunStuffPage() {
  const [phrases, setPhrases] = useState<FunPhrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPhrases();
  }, [activeType]);

  const fetchPhrases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = activeType 
        ? `/api/funstuff?type=${activeType}` 
        : '/api/funstuff';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch phrases');
      }
      const data = await response.json();
      setPhrases(data.phrases || []);
    } catch (error) {
      console.error('Failed to fetch phrases:', error);
      setError('Failed to load phrases. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter phrases based on search term
  const filteredPhrases = phrases.filter(phrase => 
    phrase.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phrase.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (phrase.example && phrase.example.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Type labels for display
  const typeLabels = {
    'idiom': { label: 'Idioms', desc: 'Expressions with meanings that can\'t be understood from the individual words' },
    'slang': { label: 'Slang', desc: 'Casual language used by particular groups' },
    'proverb': { label: 'Proverbs', desc: 'Short, well-known sayings stating a general truth or piece of advice' },
    'flirt': { label: 'Flirting Phrases', desc: 'Expressions used in romantic or playful conversation' }
  };

  // Group phrases by type for easier display
  const phrasesByType = filteredPhrases.reduce<Record<string, FunPhrase[]>>((acc, phrase) => {
    if (!acc[phrase.type]) {
      acc[phrase.type] = [];
    }
    acc[phrase.type].push(phrase);
    return acc;
  }, {});

  return (
    <div className="page-container">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex items-center">
              <LightBulbIcon className="h-8 w-8 text-yellow-500 mr-2" />
              <span>Fun Stuff</span>
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-3xl">
              Discover French idioms, slang, proverbs, and more to sound like a native speaker.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={fetchPhrases}
              className="btn btn-ghost"
              aria-label="Refresh phrases"
              disabled={isLoading}
            >
              <ArrowPathIcon className={`h-5 w-5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-medium">Dismiss</button>
        </div>
      )}

      {/* Type filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveType(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeType === null
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {Object.entries(typeLabels).map(([type, { label }]) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeType === type
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search phrases..."
            className="form-input pl-10 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Phrases list */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading phrases...</p>
        </div>
      ) : filteredPhrases.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            {searchTerm
              ? 'No phrases match your search.'
              : activeType
                ? `No phrases available for ${typeLabels[activeType as keyof typeof typeLabels]?.label} yet.`
                : 'No phrases available yet.'}
          </p>
        </div>
      ) : (
        <>
          {/* Display by type if not filtered by type already */}
          {activeType === null ? (
            Object.entries(phrasesByType).map(([type, typePhrases]) => (
              <div key={type} className="mb-10">
                <div className="flex items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {typeLabels[type as keyof typeof typeLabels]?.label}
                  </h2>
                  <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                    {typePhrases.length}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">{typeLabels[type as keyof typeof typeLabels]?.desc}</p>
                <div className="space-y-6">
                  {typePhrases.map(phrase => (
                    <PhraseCard key={phrase.id} phrase={phrase} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-6">
              {filteredPhrases.map(phrase => (
                <PhraseCard key={phrase.id} phrase={phrase} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PhraseCard({ phrase }: { phrase: FunPhrase }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Type badges styling
  const typeBadgeStyles: Record<string, string> = {
    'idiom': 'bg-blue-100 text-blue-800',
    'slang': 'bg-purple-100 text-purple-800',
    'proverb': 'bg-green-100 text-green-800',
    'flirt': 'bg-pink-100 text-pink-800'
  };

  const badgeClass = typeBadgeStyles[phrase.type] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-blue-900">{phrase.phrase}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClass}`}>
            {phrase.type.charAt(0).toUpperCase() + phrase.type.slice(1)}
          </span>
        </div>
        
        <p className="text-gray-700 mb-3">{phrase.meaning}</p>
        
        {phrase.literalTranslation && (
          <p className="text-sm text-gray-600 italic mb-3">
            <span className="font-medium">Literal translation:</span> {phrase.literalTranslation}
          </p>
        )}
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
            {phrase.example && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700">Example:</h4>
                <p className="mt-1 text-sm text-gray-600">{phrase.example}</p>
              </div>
            )}
            
            {phrase.notes && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700">Notes:</h4>
                <p className="mt-1 text-sm text-gray-600">{phrase.notes}</p>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => {
                  // Add to vocabulary logic would go here
                  alert('Feature coming soon!');
                }}
                className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Add to Vocabulary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}