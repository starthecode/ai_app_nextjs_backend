'use server';

import prisma from '@/libs/prismaDB';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    // Check if the email already exists
    const existingUser = await prisma.userList.findUnique({
      where: { email },
    });

    if (existingUser?.id) {
      console.log('existingUser', existingUser);

      return NextResponse.json(
        { success: false, message: 'Email already register' },
        { status: 200 }
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

    console.log('newUser', newUser);

    if (newUser?.id) {
      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        SECRET_KEY,
        {
          expiresIn: '7d',
        }
      );

      return NextResponse.json(
        {
          success: true,
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            userName: newUser.userName,
            picture: newUser.picture,
            credits: newUser.credits,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 200 }
    );
  }
}
