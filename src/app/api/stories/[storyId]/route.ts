import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StoryModel from '@/models/Story';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
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
    
    // Find the story by ID
    const story = await StoryModel.findById(storyId)
      .populate('vocabularyHighlights')
      .lean();  // Convert to plain object for better JSON handling
    
    if (!story) {
      console.error('Story not found with ID:', storyId);
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    
    // Convert Mongoose _id to id for consistency in the frontend
    const storyWithId = {
      ...story,
      id: story._id.toString(),
      vocabularyHighlights: story.vocabularyHighlights?.map((vocab: any) => ({
        ...vocab,
        id: vocab._id?.toString()
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