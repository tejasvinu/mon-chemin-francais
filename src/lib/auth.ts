import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { connectToDatabase } from "./mongodb";
import { compare } from "bcrypt";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

// Define a simple User schema
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
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Create a MongoDB client for the adapter
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const client = new MongoClient(process.env.MONGODB_URI);
clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "name@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Connect to the database
          await connectToDatabase();
          
          // Find user by email
          const user = await User.findOne({ email: credentials.email });
          
          // If user doesn't exist, return null
          if (!user) {
            return null;
          }

          // Compare passwords
          const isPasswordValid = await compare(credentials.password, user.password);
          
          // If passwords don't match, return null
          if (!isPasswordValid) {
            return null;
          }

          // Return user object without password
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};