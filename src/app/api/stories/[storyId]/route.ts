import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { initializeModels } from '@/lib/models';

// No separate interface

export async function GET(
  _request: NextRequest,
  // Type the context directly and explicitly inline
  context: { params: { storyId: string } }
) {
  try {
    // Access params directly from the typed context
    const { storyId } = context.params;

    // --- Validation ---
    // Check if storyId exists and is a non-empty string (basic check)
    if (!storyId || typeof storyId !== 'string' || storyId === 'undefined') {
      console.error('Missing or invalid story ID type/value:', storyId);
      return NextResponse.json({ error: 'Valid story ID is required' }, { status: 400 });
    }
    // Check if it's a valid MongoDB ObjectId format
    if (!mongoose.isValidObjectId(storyId)) {
      console.error('Invalid story ID format:', storyId);
      return NextResponse.json({ error: 'Invalid story ID format' }, { status: 400 });
    }

    // --- Database Logic ---
    await connectToDatabase();
    const { StoryModel, VocabularyModel } = initializeModels();

    // Fetch story
    const storyDoc = await StoryModel.findById(storyId).lean();

    if (!storyDoc) {
      console.error('Story not found with ID:', storyId);
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Fetch associated vocabulary
    let vocabularyItems: any[] = [];
    if (storyDoc.vocabularyHighlights && Array.isArray(storyDoc.vocabularyHighlights) && storyDoc.vocabularyHighlights.length > 0) {
       const validVocabIds = storyDoc.vocabularyHighlights
         .filter(id => id && mongoose.isValidObjectId(id));

       if (validVocabIds.length > 0) {
           vocabularyItems = await VocabularyModel.find({
             _id: { $in: validVocabIds }
           }).lean();
       } else if (storyDoc.vocabularyHighlights.length > 0) {
           // Log if the original array had items but none were valid IDs
           console.warn(`Story ${storyId} has vocabularyHighlights, but none were valid ObjectIds after filtering.`);
       }
    }

    // --- Prepare Response ---
    const storyWithId = {
      ...storyDoc,
      id: storyDoc._id.toString(),
      _id: undefined, // Remove MongoDB _id
      vocabulary: vocabularyItems.map(item => ({
        ...item,
        id: item._id.toString(),
        _id: undefined // Remove MongoDB _id
      }))
    };

    return NextResponse.json({ story: storyWithId });

  } catch (error: any) {
    // --- Error Handling ---
    console.error(`Error fetching story [ID: ${context?.params?.storyId}]:`, error); // Log the ID if available
    return NextResponse.json({
      error: 'Failed to fetch story',
      details: error.message || 'An internal server error occurred'
    }, { status: 500 });
  }
}