'use server';
// app/api/ai-models/route.ts
import prisma from '@/libs/prismaDB';
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.API_KEY; // Define your API key in the .env file

//insert User login details
export async function POST(request: NextRequest) {
  const body = await request.json(); // Parse the JSON body

  const authHeader = request.headers.get('authorization');

  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Invalid API Key' },
      { status: 401 }
    );
  }

  try {
    const result = await prisma.userList.create({
      data: {
        userEmail: body.userEmail,
        userName: body.userName,
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
  const userEmail = searchParams.get('userEmail'); // Extract email from query params

  const authHeader = request.headers.get('authorization');

  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Invalid API Key' },
      { status: 401 }
    );
  }

  if (!userEmail) {
    return NextResponse.json(
      { success: false, message: 'Missing userEmail query parameter' },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.userList.findUnique({
      where: { userEmail },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

//Update User Credit
export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // Extract email from query params

  const authHeader = request.headers.get('authorization');

  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Invalid API Key' },
      { status: 401 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Missing userEmail query parameter' },
      { status: 400 }
    );
  }

  try {
    const requestBody = await request.json();
    const { credits } = requestBody.data;

    const result = await prisma.userList.update({
      where: { id },
      data: { credits },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
