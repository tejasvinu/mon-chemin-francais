import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import FunPhraseModel from '@/models/FunPhrase';

// Authentication check middleware (reuse from other API routes)
async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { authenticated: false };
  }
  return { authenticated: true, userId: session.user.id };
}

// Get all fun phrases, optionally filtered by type
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    await connectToDatabase();
    
    // Build the query
    const query: any = {};
    if (type) {
      query.type = type;
    }
    
    // Get all fun phrases (sorted by type and phrase)
    const phrases = await FunPhraseModel.find(query).sort({ type: 1, phrase: 1 });
    
    return NextResponse.json({ phrases });
  } catch (error) {
    console.error('Error fetching fun phrases:', error);
    return NextResponse.json({ error: 'Failed to fetch fun phrases' }, { status: 500 });
  }
}

// Create a new fun phrase
export async function POST(request: Request) {
  try {
    const { authenticated, userId } = await checkAuth();
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Validation
    if (!body.phrase || !body.meaning || !body.type) {
      return NextResponse.json({ error: 'Phrase, meaning, and type are required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Create new fun phrase
    const newPhrase = await FunPhraseModel.create({
      phrase: body.phrase,
      meaning: body.meaning,
      literalTranslation: body.literalTranslation || '',
      example: body.example || '',
      type: body.type,
      notes: body.notes || '',
      createdAt: new Date()
    });
    
    return NextResponse.json(newPhrase, { status: 201 });
  } catch (error) {
    console.error('Error creating fun phrase:', error);
    return NextResponse.json({ error: 'Failed to create fun phrase' }, { status: 500 });
  }
}