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

  const authHeader = request.headers.get('authorization');

  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Invalid API Key' },
      { status: 401 }
    );
  }

  try {
    let result = '' as unknown;

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

      const formDataObj = new FormData();
      formDataObj.append('img', imageUrl);
      formDataObj.append('type', type);

      const data: never[] = [];

      const deletedImage = await uploadFile(data, formDataObj);

      if (deletedImage) {
        // 4. Delete the database entry
        await prisma.userAiGeneratedImage.delete({
          where: { id },
        });
      }
    } else {
      if (userEmail && type == null) {
        result = await prisma.userAiGeneratedImage.findMany({
          where: { userEmail },
        });
      } else {
        result = await prisma.userAiGeneratedImage.findMany();
      }
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
