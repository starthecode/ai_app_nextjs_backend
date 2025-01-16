'use server';
// app/api/ai-models/route.ts
import prisma from '@/libs/prismaDB';
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.API_KEY; // Define your API key in the .env file

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Invalid API Key' },
      { status: 401 }
    );
  }

  try {
    // Fetch records from the database
    const aiModels = await prisma.aiModel.findMany({});

    // Return the fetched data as JSON
    return NextResponse.json({ success: true, data: aiModels });
  } catch (error) {
    console.error('Error fetching AI models:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI models' },
      { status: 500 }
    );
  }
}
