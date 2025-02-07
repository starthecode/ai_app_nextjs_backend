'use server';

import prisma from '@/libs/prismaDB';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    // Check if the email already exists
    const existingUser = await prisma.userList.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      );
    }

    function generateUniqueNumber() {
      return Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
    }

    const emailUsername = email.split('@')[0];

    // Generate a 4-digit unique number
    const uniqueNumber = generateUniqueNumber();

    // Combine the username and the unique number to form the userName
    const userName = `${emailUsername}${uniqueNumber}`;

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.userList.create({
      data: {
        email,
        password: hashedPassword,
        userName,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
