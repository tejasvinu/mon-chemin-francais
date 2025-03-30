import mongoose, { Schema, Document } from 'mongoose';

export interface IGrammarExample {
  french: string;
  english: string;
  hiddenParts?: string[];
}

export interface IGrammarNote extends Document {
  title: string;
  explanation: string;
  examples: IGrammarExample[];
  createdAt: Date;
  category: string;
}

const GrammarExampleSchema = new Schema({
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
  hiddenParts: {
    type: [String]
  }
}, { _id: false });

const GrammarSchema = new Schema<IGrammarNote>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  explanation: {
    type: String,
    required: true,
    trim: true
  },
  examples: [GrammarExampleSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create index for faster queries
GrammarSchema.index({ category: 1 });
GrammarSchema.index({ title: 'text', explanation: 'text' });

const GrammarModel = mongoose.models.Grammar || mongoose.model<IGrammarNote>('Grammar', GrammarSchema, 'grammars');

export default GrammarModel;