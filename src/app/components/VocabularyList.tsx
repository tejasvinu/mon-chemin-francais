// src/components/VocabularyList.tsx (or adjust path as needed)
'use client';

import { motion } from 'framer-motion';
import { PencilSquareIcon, TrashIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

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
          <div className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{entry.french}</h3>
                  <button
                    className="p-1.5 text-blue-500 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add audio playback logic here
                    }}
                  >
                    <SpeakerWaveIcon className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-600">{entry.english}</p>
                {entry.example && (
                  <div className="mt-3 bg-gradient-to-r from-blue-50 to-white p-3 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-900">{entry.example}</p>
                  </div>
                )}
                {entry.notes && (
                  <p className="mt-2 text-sm text-gray-500 italic">{entry.notes}</p>
                )}
                {entry.category && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {entry.category}
                    </span>
                  </div>
                )}
              </div>

              {!readOnly && (
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(entry)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(entry.id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              )}
            </div>

            {/* SRS Level Indicator */}
            {entry.srsLevel !== undefined && (
              <div className="mt-3 flex items-center">
                <div className="flex-grow">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                      style={{ width: `${(entry.srsLevel / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="ml-2 text-xs text-gray-500">
                  Level {entry.srsLevel}/5
                </span>
              </div>
            )}

            {/* Next Review Date */}
            {entry.nextReview && (
              <p className="mt-2 text-xs text-gray-500">
                Next review: {new Date(entry.nextReview).toLocaleDateString()}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}