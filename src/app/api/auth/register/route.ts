import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

// Define User schema (or import from a shared location)
const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
});

// Create or retrieve the User model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    const userWithoutPassword = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
    };

    return NextResponse.json(
      { message: 'User registered successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}