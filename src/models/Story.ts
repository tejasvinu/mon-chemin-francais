import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
  title: string;
  level: string;
  content: string;
  translation?: string;
  vocabularyHighlights?: mongoose.Schema.Types.ObjectId[];
  comprehensionQuestions?: Array<{
    question: string;
    options: string[];
    correctAnswerIndex: number;
  }>;
  createdAt: Date;
}

const StorySchema = new Schema<IStory>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    required: true,
    enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  translation: {
    type: String
  },
  vocabularyHighlights: [{
    type: Schema.Types.ObjectId,
    ref: 'Vocabulary'
  }],
  comprehensionQuestions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswerIndex: {
      type: Number,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for faster queries
StorySchema.index({ level: 1 });
StorySchema.index({ title: 1 });

const StoryModel = mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema);

export default StoryModel;