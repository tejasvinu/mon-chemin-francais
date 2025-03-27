import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { GrammarNote } from '@/app/types';

const dataFilePath = path.join(process.cwd(), 'src/app/data/grammar.json');

async function readGrammarFile() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { notes: [] };
  }
}

export async function GET() {
  const data = await readGrammarFile();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await readGrammarFile();
  
  const newNote: GrammarNote = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...body
  };

  data.notes.push(newNote);
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  
  return NextResponse.json(newNote);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = await readGrammarFile();
  
  const index = data.notes.findIndex((note: GrammarNote) => note.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }

  data.notes[index] = { ...data.notes[index], ...body };
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  
  return NextResponse.json(data.notes[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const data = await readGrammarFile();
  data.notes = data.notes.filter((note: GrammarNote) => note.id !== id);
  
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  return NextResponse.json({ success: true });
}