import mongoose, { Schema, Document } from 'mongoose';

export interface IVocabularyEntry extends Document {
  userId?: mongoose.Schema.Types.ObjectId;
  french: string;
  english: string;
  example?: string;
  notes?: string;
  category?: string;
  createdAt: Date;
  lastReviewed?: Date;
  nextReview?: Date;
  srsLevel: number;
}

const VocabularySchema = new Schema<IVocabularyEntry>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  french: {
    type: String,
    required: true,
    trim: true
  },
  english: {
    type: String,
    required: true,
    trim: true
  },
  example: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    default: 'Uncategorized'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastReviewed: {
    type: Date
  },
  nextReview: {
    type: Date
  },
  srsLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 7
  }
}, {
  timestamps: true
});

// Create index for faster queries
VocabularySchema.index({ category: 1 });
VocabularySchema.index({ french: 'text', english: 'text' });

const VocabularyModel = mongoose.models.Vocabulary || mongoose.model<IVocabularyEntry>('Vocabulary', VocabularySchema, 'vocabularies');

export default VocabularyModel;