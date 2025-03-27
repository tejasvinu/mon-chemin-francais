import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StoryModel from '@/models/Story';

// Get a specific story by ID
export async function GET(
  request: Request,
  { params }: { params: { storyId: string } }
) {
  try {
    const { storyId } = params;
    
    if (!storyId) {
      return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Find the story by ID
    const story = await StoryModel.findById(storyId).populate('vocabularyHighlights');
    
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    
    return NextResponse.json({ story });
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 });
  }
}