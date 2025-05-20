# Mon Chemin Français - Your Personalized Journey to French Fluency

Mon Chemin Français is a full-stack web application built with Next.js, TypeScript, MongoDB, and NextAuth.js, designed to help users learn French through various interactive modules.

## Table of Contents

1.  [Features](#features)
2.  [Tech Stack](#tech-stack)
3.  [Prerequisites](#prerequisites)
4.  [Environment Variables](#environment-variables)
5.  [Getting Started](#getting-started)
    *   [Installation](#installation)
    *   [Data Seeding](#data-seeding)
    *   [Running the Application](#running-the-application)
6.  [Available Scripts](#available-scripts)
7.  [Project Structure](#project-structure)
8.  [API Endpoints](#api-endpoints)
9.  [Deployment](#deployment)

## Features

*   **User Authentication:** Secure registration and login using NextAuth.js with email/password credentials.
*   **Vocabulary Management (Le Lexique):**
    *   Add, edit, and delete French vocabulary entries with English translations, examples, notes, and categories.
    *   Search and filter vocabulary.
*   **Flashcard System (Mémoire Adaptive):**
    *   Review vocabulary using an interactive flashcard system.
    *   SRS (Spaced Repetition System) like levels for vocabulary items.
    *   Text-to-Speech (TTS) for listening to French and English pronunciations.
*   **Grammar Notes (La Structure):**
    *   View categorized grammar explanations with examples.
    *   Search and filter grammar notes.
*   **Interactive Stories (Les Histoires):**
    *   Read stories tailored for different French proficiency levels (A1-C2).
    *   View translations paragraph by paragraph.
    *   Key vocabulary highlighted within stories, linked to vocabulary entries.
    *   Comprehension questions to test understanding.
    *   Text-to-Speech for story content.
*   **Fun Stuff (Explore):**
    *   Discover playful French expressions, idioms, slang, and proverbs.
*   **Text-to-Speech (TTS):** Integrated across modules for pronunciation practice using browser's Speech Synthesis API.
*   **Responsive Design:** User-friendly interface on various devices, built with Tailwind CSS.
*   **Artistic & Animated UI:** Engaging user experience with Framer Motion animations and a visually appealing design.

## Tech Stack

*   **Frontend:**
    *   Next.js 15 (App Router)
    *   React 19
    *   TypeScript
    *   Tailwind CSS 4
    *   Framer Motion (Animations)
    *   Headless UI (UI Components)
    *   Heroicons (Icons)
*   **Backend:**
    *   Next.js API Routes
    *   Node.js
*   **Database:**
    *   MongoDB
    *   Mongoose (ODM)
*   **Authentication:**
    *   NextAuth.js (Credentials Provider, MongoDB Adapter)
*   **Other:**
    *   bcrypt (Password Hashing)
    *   dotenv (Environment Variables)

## Prerequisites

*   Node.js (v18.x or later recommended)
*   npm, yarn, or pnpm
*   MongoDB instance (local or cloud-hosted like MongoDB Atlas)

## Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_strong_random_secret_for_nextauth # Generate one (e.g., `openssl rand -base64 32`)
NEXTAUTH_URL=http://localhost:3000 # For development. Update for production.
```

## Getting Started

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/tejasvinu-mon-chemin-francais.git
    cd tejasvinu-mon-chemin-francais
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### Data Seeding

The project includes a seed script to populate your database with initial data for vocabulary, grammar, stories, and fun phrases.

1.  **Prepare Data Files (Important):**
    The seed script (`src/scripts/seed.js`) expects JSON data files to be located in `src/app/data/`. You need to create this directory and the following JSON files with your data:
    *   `src/app/data/vocabulary.json`
    *   `src/app/data/grammar.json`
    *   `src/app/data/stories.json`
    *   `src/app/data/funstuff.json`

    **Example `src/app/data/vocabulary.json` structure:**
    ```json
    {
      "entries": [
        {
          "french": "Bonjour",
          "english": "Hello",
          "example": "Bonjour, comment ça va ?",
          "notes": "Formal greeting.",
          "category": "Greetings",
          "srsLevel": 0
        }
        // ... more entries
      ]
    }
    ```
    Refer to the Mongoose schemas in `src/models/` for the expected structure of each data type (Grammar, Story, FunPhrase). For stories with `vocabularyHighlights`, the `stories.json` should use a `vocabFrenchWords` array containing the French terms, which the seed script will use to look up and link existing vocabulary entries.

2.  **Run the seed script:**
    Ensure your `.env.local` file is configured with `MONGODB_URI`.
    ```bash
    node src/scripts/seed.js
    ```
    This will clear existing data in the collections and insert the data from your JSON files.

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

2.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

*   `npm run dev`: Starts the development server (with Turbopack).
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Lints the project using Next.js's built-in ESLint configuration.

## Project Structure

```
└── tejasvinu-mon-chemin-francais/
    ├── public/                 # Static assets (images, fonts)
    ├── src/
    │   ├── app/                # Next.js App Router
    │   │   ├── (pages)/        # Route groups for UI pages (e.g., vocabulary, stories)
    │   │   ├── api/            # API route handlers
    │   │   ├── components/     # Reusable React components
    │   │   ├── providers/      # Context providers (Session, TTS)
    │   │   ├── types/          # TypeScript type definitions for pages/app
    │   │   ├── globals.css     # Global styles
    │   │   └── layout.tsx      # Root layout
    │   │   └── page.tsx        # Homepage
    │   ├── lib/                # Core libraries (auth, MongoDB connection, model initializers)
    │   ├── models/             # Mongoose schemas and models
    │   ├── scripts/            # Utility scripts (e.g., seed.js)
    │   └── types/              # Global TypeScript definitions (e.g., next-auth.d.ts)
    ├── .env.local              # Environment variables (ignored by Git)
    ├── next.config.ts          # Next.js configuration
    ├── package.json            # Project dependencies and scripts
    ├── tailwind.config.js      # Tailwind CSS configuration
    └── tsconfig.json           # TypeScript configuration
```

## API Endpoints

The application uses Next.js API Routes for backend functionality. Key endpoints include:

*   **Authentication:**
    *   `POST /api/auth/register`: User registration.
    *   `/api/auth/[...nextauth]`: Handles login, logout, session management (NextAuth.js).
*   **Vocabulary:**
    *   `GET /api/vocabulary`: Fetch all vocabulary entries.
    *   `POST /api/vocabulary`: Add a new vocabulary entry.
    *   `PUT /api/vocabulary`: Update an existing vocabulary entry.
    *   `DELETE /api/vocabulary?id=<entryId>`: Delete a vocabulary entry.
*   **Grammar:**
    *   `GET /api/grammar`: Fetch all grammar notes.
    *   `POST /api/grammar`: Add a new grammar note (admin/protected).
*   **Stories:**
    *   `GET /api/stories`: Fetch all stories (can be filtered by level).
    *   `GET /api/stories/[storyId]`: Fetch a specific story by ID, including vocabulary highlights.
*   **Fun Stuff:**
    *   `GET /api/funstuff`: Fetch all fun phrases (can be filtered by type).
    *   `POST /api/funstuff`: Add a new fun phrase (admin/protected).

Note: Some POST/PUT/DELETE operations might be implicitly admin-protected or require authentication, as handled by the `checkAuth` utility within the API routes.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Ensure your environment variables (`MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) are set up in your Vercel project settings.

---