'use server';
// app/api/ai-models/route.ts
import prisma from '@/libs/prismaDB';
import { uploadFile } from '@/libs/upload';
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.API_KEY; // Define your API key in the .env file

export async function POST(request: NextRequest) {
  const body = await request.json(); // Parse the JSON body

  const authHeader = request.headers.get('authorization');

  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Invalid API Key' },
      { status: 401 }
    );
  }

  // Validate the request body
  if (!body?.data?.userEmail || !body?.data?.imageUrl) {
    return NextResponse.json(
      { success: false, message: 'Invalid input data' },
      { status: 400 }
    );
  }

  const { data } = body;

  try {
    const result = await prisma.userAiGeneratedImage.create({
      data: {
        userEmail: data?.userEmail,
        imageUrl: data?.imageUrl,
        prompt: data?.prompt,
        category: 'new',
        modelUsed: data?.modelUsed,
      },
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error posting users data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to post data' },
      { status: 500 }
    );
  }
}

//get unique user details
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get('userEmail');
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const takeParam = searchParams.get('take');
  const skipParam = searchParams.get('skip'); // New parameter for pagination
  const take = takeParam ? parseInt(takeParam, 10) || undefined : undefined;
  const skip = skipParam ? parseInt(skipParam, 10) || 0 : 0; // Default to 0
  const modelUsed = searchParams.get('modelUsed');

  const authHeader = request.headers.get('authorization');

  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Invalid API Key' },
      { status: 401 }
    );
  }

  try {
    let result = [];

    // ✅ DELETE Logic (Kept as it is)
    if (type === 'delete' && userEmail && id) {
      const imageEntry = await prisma.userAiGeneratedImage.findUnique({
        where: { id },
      });

      if (!imageEntry) {
        return NextResponse.json(
          { success: false, message: 'Image entry not found' },
          { status: 404 }
        );
      }

      const imageUrl = imageEntry.imageUrl;

      const data = new FormData();
      data.append('img', imageUrl);
      data.append('type', type);

      const bufferbyai: Buffer | null = null; // Initialize to null

      const deletedImage = await uploadFile(data, bufferbyai);

      if (deletedImage) {
        // Delete the database entry
        await prisma.userAiGeneratedImage.delete({
          where: { id },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Image deleted successfully',
      });
    }

    // ✅ FETCH Logic with Pagination
    if (userEmail && type == null) {
      result = await prisma.userAiGeneratedImage.findMany({
        where: { userEmail },
        skip, // Pagination
        take, // Limit
        orderBy: { createdAt: 'desc' }, // Ensure newest first
      });
    } else {
      result = await prisma.userAiGeneratedImage.findMany({
        where: modelUsed ? { modelUsed } : undefined,
        skip, // Pagination
        take, // Limit
        orderBy: { createdAt: 'desc' }, // Ensure newest first
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
