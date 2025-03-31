import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from '@/lib/mongodb';
import GrammarModel from '@/models/Grammar';

// Authentication check middleware
async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { authenticated: false };
  }
  return { authenticated: true, userId: session.user.id };
}

// All users can view grammar notes (shared resource)
export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all grammar notes (sorted by category)
    const notes = await GrammarModel.find().sort({ category: 1, title: 1 });
    
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error fetching grammar notes:', error);
    return NextResponse.json({ error: 'Failed to fetch grammar notes' }, { status: 500 });
  }
}

// Only admins can create new grammar notes (for now)
export async function POST(request: Request) {
  try {
    const { authenticated } = await checkAuth();
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Validation
    if (!body.title || !body.explanation || !body.category) {
      return NextResponse.json({ error: 'Title, explanation, and category are required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Create new grammar note
    const newNote = await GrammarModel.create({
      title: body.title,
      explanation: body.explanation,
      examples: body.examples || [],
      category: body.category,
      createdAt: new Date()
    });
    
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('Error creating grammar note:', error);
    return NextResponse.json({ error: 'Failed to create grammar note' }, { status: 500 });
  }
}

// Only admins can update grammar notes (for now)
export async function PUT(request: Request) {
  try {
    const { authenticated } = await checkAuth();
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (!body._id) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Update the grammar note
    const updatedNote = await GrammarModel.findByIdAndUpdate(
      body._id,
      {
        title: body.title,
        explanation: body.explanation,
        examples: body.examples,
        category: body.category
      },
      { new: true } // Return the updated document
    );
    
    if (!updatedNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Error updating grammar note:', error);
    return NextResponse.json({ error: 'Failed to update grammar note' }, { status: 500 });
  }
}

// Only admins can delete grammar notes (for now)
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
    
    // Find and delete the note
    const result = await GrammarModel.deleteOne({ _id: id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting grammar note:', error);
    return NextResponse.json({ error: 'Failed to delete grammar note' }, { status: 500 });
  }
}