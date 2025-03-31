// Model initialization utility
import VocabularyModel from '@/models/Vocabulary';
import StoryModel from '@/models/Story';

/**
 * Ensures all models are properly registered with Mongoose
 * Call this function before using populate() with related models
 */
export function initializeModels() {
  // Simply importing the models ensures they're registered
  // This function provides a clear way to ensure all models are loaded
  return { VocabularyModel, StoryModel };
}