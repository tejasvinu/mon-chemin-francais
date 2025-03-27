import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { VocabularyEntry } from '@/app/types';

const dataFilePath = path.join(process.cwd(), 'src/app/data/vocabulary.json');

async function readVocabularyFile() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { entries: [] };
  }
}

export async function GET() {
  const data = await readVocabularyFile();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await readVocabularyFile();
  
  const newEntry: VocabularyEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    srsLevel: 0,
    ...body
  };

  data.entries.push(newEntry);
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  
  return NextResponse.json(newEntry);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = await readVocabularyFile();
  
  const index = data.entries.findIndex((entry: VocabularyEntry) => entry.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  data.entries[index] = { ...data.entries[index], ...body };
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  
  return NextResponse.json(data.entries[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const data = await readVocabularyFile();
  data.entries = data.entries.filter((entry: VocabularyEntry) => entry.id !== id);
  
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  return NextResponse.json({ success: true });
}