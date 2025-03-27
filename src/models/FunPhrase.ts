import mongoose, { Schema, Document } from 'mongoose';

export interface IFunPhrase extends Document {
  phrase: string;
  meaning: string;
  literalTranslation?: string;
  example?: string;
  type: 'idiom' | 'slang' | 'proverb' | 'flirt';
  notes?: string;
  createdAt: Date;
}

const FunPhraseSchema = new Schema<IFunPhrase>({
  phrase: {
    type: String,
    required: true,
    trim: true
  },
  meaning: {
    type: String,
    required: true,
    trim: true
  },
  literalTranslation: {
    type: String,
    trim: true
  },
  example: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['idiom', 'slang', 'proverb', 'flirt'],
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for faster queries
FunPhraseSchema.index({ type: 1 });
FunPhraseSchema.index({ phrase: 'text', meaning: 'text' });

const FunPhraseModel = mongoose.models.FunPhrase || mongoose.model<IFunPhrase>('FunPhrase', FunPhraseSchema);

export default FunPhraseModel;