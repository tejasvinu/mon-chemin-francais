import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from '@/lib/mongodb';
import VocabularyModel from '@/models/Vocabulary';

// Authentication check middleware
async function checkAuth() {
  console.log('[DEBUG-API] Checking authentication');
  const session = await getServerSession(authOptions);
  console.log('[DEBUG-API] Session:', session ? 'exists' : 'null', 'user:', session?.user?.email);
  
  if (!session || !session.user) {
    console.log('[DEBUG-API] Authentication failed: no session or user');
    return { authenticated: false };
  }
  console.log('[DEBUG-API] Authentication successful, userId:', session.user.id);
  return { authenticated: true, userId: session.user.id };
}

export async function GET() {
  console.log('[DEBUG-API] Received GET request for vocabulary');
  try {
    const { authenticated, userId } = await checkAuth();
    
    if (!authenticated) {
      console.log('[DEBUG-API] Unauthorized request, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('[DEBUG-API] Connecting to database');
    await connectToDatabase();
    
    // Get ALL vocabulary entries regardless of userId
    console.log('[DEBUG-API] Fetching ALL vocabulary entries (no userId filter)');
    const entries = await VocabularyModel.find({}).sort({ createdAt: -1 });
    console.log('[DEBUG-API] Found entries:', entries.length);
    
    if (entries.length === 0) {
      console.log('[DEBUG-API] No entries found, checking collection name');
      // Log collection information for debugging
      const collections = await VocabularyModel.db.db.listCollections().toArray();
      console.log('[DEBUG-API] Collections in database:', collections.map(c => c.name));
    }
    
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('[DEBUG-API] Error fetching vocabulary:', error);
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
    
    // Create new vocabulary entry without userId
    const newEntry = await VocabularyModel.create({
      // Removed userId association
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
    const { authenticated } = await checkAuth();
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (!body._id) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Find the entry without checking userId
    const existingEntry = await VocabularyModel.findOne({ _id: body._id });
    
    if (!existingEntry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
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
    const { authenticated } = await checkAuth();
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Find and delete the entry without checking userId
    const result = await VocabularyModel.deleteOne({ _id: id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vocabulary entry:', error);
    return NextResponse.json({ error: 'Failed to delete vocabulary entry' }, { status: 500 });
  }
}