import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import VocabularyModel from '@/models/Vocabulary';

// Authentication check middleware
async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { authenticated: false };
  }
  return { authenticated: true, userId: session.user.id };
}

export async function GET() {
  try {
    const { authenticated, userId } = await checkAuth();
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectToDatabase();
    
    // Get all vocabulary entries for the current user
    const entries = await VocabularyModel.find({ userId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
    return NextResponse.json({ error: 'Failed to fetch vocabulary' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { authenticated, userId } = await checkAuth();
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Validation
    if (!body.french || !body.english) {
      return NextResponse.json({ error: 'French and English fields are required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Create new vocabulary entry
    const newEntry = await VocabularyModel.create({
      userId,
      french: body.french,
      english: body.english,
      example: body.example || '',
      notes: body.notes || '',
      category: body.category || 'Uncategorized',
      srsLevel: 0,
      createdAt: new Date()
    });
    
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating vocabulary entry:', error);
    return NextResponse.json({ error: 'Failed to create vocabulary entry' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { authenticated, userId } = await checkAuth();
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (!body._id) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Find the entry and ensure it belongs to the current user
    const existingEntry = await VocabularyModel.findOne({ _id: body._id, userId });
    
    if (!existingEntry) {
      return NextResponse.json({ error: 'Entry not found or unauthorized' }, { status: 404 });
    }
    
    // Update the entry with new data
    const updatedEntry = await VocabularyModel.findByIdAndUpdate(
      body._id,
      {
        french: body.french,
        english: body.english,
        example: body.example,
        notes: body.notes,
        category: body.category,
        srsLevel: body.srsLevel,
        lastReviewed: body.lastReviewed,
        nextReview: body.nextReview
      },
      { new: true } // Return the updated document
    );
    
    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error('Error updating vocabulary entry:', error);
    return NextResponse.json({ error: 'Failed to update vocabulary entry' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { authenticated, userId } = await checkAuth();
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Find and delete the entry, ensuring it belongs to the current user
    const result = await VocabularyModel.deleteOne({ _id: id, userId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Entry not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vocabulary entry:', error);
    return NextResponse.json({ error: 'Failed to delete vocabulary entry' }, { status: 500 });
  }
}