import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { initializeModels } from '@/lib/models';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ storyId: string }> | { storyId: string } }
) {
  try {
    // Properly await params if they are a Promise
    const params = context.params instanceof Promise ? await context.params : context.params;
    const { storyId } = params;

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
    
    // Initialize all models first to ensure they're registered
    const { StoryModel, VocabularyModel } = initializeModels();

    // First fetch the story
    const storyDoc = await StoryModel.findById(storyId).lean();

    if (!storyDoc) {
      console.error('Story not found with ID:', storyId);
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // If the story has vocabulary highlights, fetch them separately
    let vocabularyItems = [];
    if (storyDoc.vocabularyHighlights && storyDoc.vocabularyHighlights.length > 0) {
      vocabularyItems = await VocabularyModel.find({
        _id: { $in: storyDoc.vocabularyHighlights }
      }).lean();
    }

    // First cast to unknown to bypass TypeScript's type checking constraints
    const story = storyDoc as unknown as {
      _id: mongoose.Types.ObjectId;
      [key: string]: any;
    };

    // Convert Mongoose _id to id for consistency in the frontend
    const storyWithId = {
      ...story,
      id: story._id.toString(),
      vocabulary: vocabularyItems.map(item => ({
        ...item,
        id: item._id.toString()
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