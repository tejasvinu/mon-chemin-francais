// src/components/VocabularyList.tsx
'use client';

import { motion } from 'framer-motion';
import { PencilSquareIcon, TrashIcon, SpeakerWaveIcon, StopIcon } from '@heroicons/react/24/outline';
import { useTTS } from './TTSProvider';

interface VocabularyListProps {
  entries: any[];
  onEdit: (entry: any) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export default function VocabularyList({ entries, onEdit, onDelete, readOnly = false }: VocabularyListProps) {
  const { speak, isLoading, isSpeaking, stop } = useTTS();

  const handleSpeak = (text: string, isEnglish: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stop();
    } else {
      speak(text, isEnglish);
    }
  };

  return (
    <motion.div
      className="divide-y divide-gray-200/50"
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {entries.map((entry) => (
        <motion.div
          key={entry.id}
          variants={itemVariants}
          className="group relative backdrop-blur-sm bg-white/60 hover:bg-white/80 transition-colors duration-200"
        >
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-grow min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-1.5">
                  <h3 className="text-md sm:text-lg font-semibold text-gray-900 truncate">{entry.french}</h3>
                  <button
                    className="p-1.5 text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50 self-start sm:self-center opacity-60 group-hover:opacity-100 focus:opacity-100"
                    onClick={(e) => handleSpeak(entry.french, false, e)}
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
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <p className="text-sm sm:text-base text-gray-600 truncate">{entry.english}</p>
                  <button
                    className="p-1.5 text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50 opacity-60 group-hover:opacity-100 focus:opacity-100"
                    onClick={(e) => handleSpeak(entry.english, true, e)}
                    disabled={isLoading}
                    title="Listen in English"
                  >
                    <SpeakerWaveIcon className="h-4 w-4" />
                  </button>
                </div>
                {entry.example && (
                  <div className="mt-2 bg-gradient-to-r from-blue-50 to-white p-2.5 rounded-md border border-blue-100">
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm text-blue-900">{entry.example}</p>
                      <button
                        className="p-1 text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50 opacity-60 group-hover:opacity-100 focus:opacity-100 flex-shrink-0"
                        onClick={(e) => handleSpeak(entry.example, false, e)}
                        disabled={isLoading}
                        title="Listen to example"
                      >
                        <SpeakerWaveIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
                {entry.notes && (
                  <p className="mt-2 text-xs sm:text-sm text-gray-500 italic">{entry.notes}</p>
                )}
                {entry.category && (
                  <div className="mt-2 sm:mt-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {entry.category}
                    </span>
                  </div>
                )}
              </div>

              {!readOnly && (
                <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(entry)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-md"
                    title="Edit entry"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(entry.id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-md"
                    title="Delete entry"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              )}
            </div>

            {/* SRS Level Indicator */}
            {entry.srsLevel !== undefined && (
              <div className="mt-2 sm:mt-3 flex items-center">
                <div className="flex-grow">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                      style={{ width: `${(entry.srsLevel / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="ml-2 text-2xs sm:text-xs text-gray-500 whitespace-nowrap">
                  Level {entry.srsLevel}/5
                </span>
              </div>
            )}

            {/* Next Review Date */}
            {entry.nextReview && (
              <p className="mt-1.5 text-2xs sm:text-xs text-gray-500">
                Next review: {new Date(entry.nextReview).toLocaleDateString()}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}