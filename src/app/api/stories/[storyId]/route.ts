import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StoryModel, { IStory } from '@/models/Story';
import mongoose from 'mongoose';

export async function GET(
  _request: NextRequest,
  context: { params: { storyId: string } }
) {
  try {
    const storyId = context.params.storyId;

    // Handle missing storyId with clear error message
    if (!storyId || storyId === 'undefined') {
      console.error('Missing or invalid story ID:', storyId);
      return NextResponse.json({ error: 'Valid story ID is required' }, { status: 400 });
    }

    // Validate ID format to prevent Mongoose errors
    if (!mongoose.isValidObjectId(storyId)) {
      console.error('Invalid story ID format:', storyId);
      return NextResponse.json({ error: 'Invalid story ID format' }, { status: 400 });
    }

    await connectToDatabase();

    // Using a safer type assertion approach
    const storyDoc = await StoryModel.findById(storyId).populate('vocabularyHighlights').lean();

    if (!storyDoc) {
      console.error('Story not found with ID:', storyId);
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // First cast to unknown to bypass TypeScript's type checking constraints
    const story = storyDoc as unknown as {
      _id: mongoose.Types.ObjectId;
      vocabularyHighlights?: Array<{ _id: mongoose.Types.ObjectId | string }>;
      [key: string]: any;
    };

    // Convert Mongoose _id to id for consistency in the frontend
    const storyWithId = {
      ...story,
      id: story._id.toString(),
      vocabularyHighlights: story.vocabularyHighlights?.map(vocab => ({
        ...vocab,
        id: vocab._id.toString()
      }))
    };

    return NextResponse.json({ story: storyWithId });
  } catch (error: any) {
    console.error('Error fetching story:', error.message || error);
    return NextResponse.json({
      error: 'Failed to fetch story',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}