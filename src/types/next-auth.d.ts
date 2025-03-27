import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extending the built-in session types
   */
  interface Session {
    user: {
      /** User's unique identifier */
      id: string;
    } & DefaultSession["user"];
  }
}