import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from '@/lib/mongodb';
import { initializeModels } from '@/lib/models';

// Authentication check middleware (reuse from other API routes)
async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { authenticated: false };
  }
  return { authenticated: true, userId: session.user.id };
}

// Get all stories or filter by level
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    
    await connectToDatabase();
    
    // Initialize models to ensure they're registered
    const { StoryModel } = initializeModels();
    
    // Build the query
    const query: any = {};
    if (level) {
      query.level = level;
    }
    
    // Get all stories (sorted by level and title)
    const storiesData = await StoryModel.find(query).sort({ level: 1, title: 1 }).lean();
    
    // Convert MongoDB _id to string id for frontend use
    const stories = storiesData.map(story => ({
      ...story,
      id: story._id.toString(),
      _id: undefined // Remove the MongoDB _id to avoid confusion
    }));
    
    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}