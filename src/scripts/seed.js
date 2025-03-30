// scripts/seed.js
require('dotenv').config({ path: '.env.local' }); // Load environment variables from .env.local
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// --- Import Models ---
// Import models directly through mongoose to avoid TypeScript import issues
let VocabularyModel, GrammarModel, StoryModel, FunPhraseModel;

// --- Configuration ---
const MONGODB_URI = process.env.MONGODB_URI;

// --- Define Paths to JSON Data ---
// Fix the paths to be relative to the current file in Next.js structure
const dataDir = path.join(__dirname, '../app/data');
const vocabularyDataPath = path.join(dataDir, 'vocabulary.json');
const grammarDataPath = path.join(dataDir, 'grammar.json');
const storiesDataPath = path.join(dataDir, 'stories.json');
const funStuffDataPath = path.join(dataDir, 'funstuff.json');

// --- Helper Function to Load JSON ---
function loadJsonData(filePath, keyName) {
    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(rawData);
        console.log(`Loaded ${jsonData[keyName]?.length ?? 0} items from ${path.basename(filePath)}.`);
        return jsonData[keyName] || []; // Return the array under the key, or empty array
    } catch (error) {
        console.error(`Error reading data from ${filePath}:`, error.message);
        console.log(`Proceeding without data from ${path.basename(filePath)}.`);
        return []; // Return empty array on error
    }
}

// --- Load Seed Data ---
const vocabularyEntries = loadJsonData(vocabularyDataPath, 'entries');
const grammarNotes = loadJsonData(grammarDataPath, 'notes');
const storyEntries = loadJsonData(storiesDataPath, 'stories');
const funPhraseEntries = loadJsonData(funStuffDataPath, 'phrases');


// --- Seeding Function ---
async function seedDatabase() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not defined in .env.local');
        process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected.');

    // Initialize models after mongoose connection is established
    // This avoids issues with importing TypeScript models in a CommonJS environment
    VocabularyModel = mongoose.models.Vocabulary || mongoose.model('Vocabulary', new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        french: {
            type: String,
            required: true,
            trim: true
        },
        english: {
            type: String,
            required: true,
            trim: true
        },
        example: {
            type: String,
            trim: true
        },
        notes: {
            type: String,
            trim: true
        },
        category: {
            type: String,
            trim: true,
            default: 'Uncategorized'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        lastReviewed: {
            type: Date
        },
        nextReview: {
            type: Date
        },
        srsLevel: {
            type: Number,
            default: 0,
            min: 0,
            max: 7
        }
    }, { timestamps: true }));

    GrammarModel = mongoose.models.Grammar || mongoose.model('Grammar', new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true
        },
        explanation: {
            type: String,
            required: true,
            trim: true
        },
        examples: [{
            french: {
                type: String,
                required: true,
                trim: true
            },
            english: {
                type: String, 
                required: true,
                trim: true
            },
            hiddenParts: {
                type: [String]
            }
        }],
        createdAt: {
            type: Date,
            default: Date.now
        },
        category: {
            type: String,
            required: true,
            trim: true
        }
    }, { timestamps: true }));

    StoryModel = mongoose.models.Story || mongoose.model('Story', new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true
        },
        level: {
            type: String,
            required: true,
            enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
            trim: true
        },
        content: {
            type: String,
            required: true
        },
        translation: {
            type: String
        },
        vocabularyHighlights: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vocabulary'
        }],
        comprehensionQuestions: [{
            question: {
                type: String,
                required: true
            },
            options: [{
                type: String,
                required: true
            }],
            correctAnswerIndex: {
                type: Number,
                required: true
            }
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }, { timestamps: true }));

    FunPhraseModel = mongoose.models.FunPhrase || mongoose.model('FunPhrase', new mongoose.Schema({
        phrase: {
            type: String,
            required: true,
            trim: true
        },
        meaning: {
            type: String,
            required: true,
            trim: true
        },
        literalTranslation: {
            type: String,
            trim: true
        },
        example: {
            type: String,
            trim: true
        },
        type: {
            type: String,
            required: true,
            enum: ['idiom', 'slang', 'proverb', 'flirt'],
            trim: true
        },
        notes: {
            type: String,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }, { timestamps: true }));

    // Store vocabulary IDs for linking
    const vocabMap = new Map(); // frenchWord -> _id

    try {
        // 1. Seed Vocabulary (without user association)
        console.log('\n--- Seeding Vocabulary ---');
        await VocabularyModel.deleteMany({}); // Clear all vocabulary
        console.log('Cleared existing vocabulary.');
        if (vocabularyEntries.length > 0) {
            const vocabularyToSeed = vocabularyEntries.map(entry => ({
                ...entry,
                // Removed userId requirement - this is the key change
                id: undefined, // Remove JSON 'id', mongoose uses _id
                _id: undefined, // Ensure mongoose generates its own _id
                createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(),
                lastReviewed: entry.lastReviewed ? new Date(entry.lastReviewed) : undefined,
                nextReview: entry.nextReview ? new Date(entry.nextReview) : undefined,
            }));
            const insertedVocab = await VocabularyModel.insertMany(vocabularyToSeed);
            console.log(`Seeded ${insertedVocab.length} vocabulary entries.`);
            // Populate the map for linking
            insertedVocab.forEach(v => vocabMap.set(v.french, v._id));
            console.log(`Created map for ${vocabMap.size} vocabulary items.`);
        } else {
            console.log('No vocabulary data loaded to seed.');
        }

        // 2. Seed Grammar
        console.log('\n--- Seeding Grammar ---');
        await GrammarModel.deleteMany({}); // Clear all grammar
        console.log('Cleared existing grammar notes.');
        if (grammarNotes.length > 0) {
            const grammarToSeed = grammarNotes.map(note => ({
                ...note,
                id: undefined,
                _id: undefined,
                createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
            }));
            const insertedGrammar = await GrammarModel.insertMany(grammarToSeed);
            console.log(`Seeded ${insertedGrammar.length} grammar notes.`);
        } else {
            console.log('No grammar data loaded to seed.');
        }

        // 3. Seed Stories
        console.log('\n--- Seeding Stories ---');
        await StoryModel.deleteMany({}); // Clear all stories
        console.log('Cleared existing stories.');
        if (storyEntries.length > 0) {
            const storiesToSeed = storyEntries.map(story => {
                // Link vocabulary highlights using the map
                const highlightIds = (story.vocabFrenchWords || [])
                    .map(frenchWord => vocabMap.get(frenchWord))
                    .filter(id => id); // Filter out null/undefined IDs (words not found)

                if(story.vocabFrenchWords && story.vocabFrenchWords.length > 0) {
                    console.log(`   Linking story "${story.title}" to ${highlightIds.length}/${story.vocabFrenchWords.length} vocab items.`);
                }

                return {
                    ...story,
                    id: undefined,
                    _id: undefined,
                    vocabularyHighlights: highlightIds,
                    vocabFrenchWords: undefined, // Remove the temporary field
                    createdAt: story.createdAt ? new Date(story.createdAt) : new Date(),
                };
            });
            const insertedStories = await StoryModel.insertMany(storiesToSeed);
            console.log(`Seeded ${insertedStories.length} stories.`);
        } else {
            console.log('No story data loaded to seed.');
        }

        // 4. Seed Fun Stuff
        console.log('\n--- Seeding Fun Stuff ---');
        await FunPhraseModel.deleteMany({}); // Clear all fun phrases
        console.log('Cleared existing fun phrases.');
        if (funPhraseEntries.length > 0) {
            const funPhrasesToSeed = funPhraseEntries.map(phrase => ({
                ...phrase,
                id: undefined,
                _id: undefined,
                createdAt: phrase.createdAt ? new Date(phrase.createdAt) : new Date(),
            }));
            const insertedPhrases = await FunPhraseModel.insertMany(funPhrasesToSeed);
            console.log(`Seeded ${insertedPhrases.length} fun phrases.`);
        } else {
            console.log('No fun phrase data loaded to seed.');
        }

        console.log('\n✅ Database seeding completed successfully!');

    } catch (error) {
        console.error('\n❌ Error during database seeding:', error);
    } finally {
        console.log('\nClosing MongoDB connection...');
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
}

// --- Run the Seeder ---
seedDatabase();