'use server';
import prisma from '@/libs/prismaDB';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(request: NextRequest) {
  const { email, password, otp } = await request.json();

  try {
    // Check if the otp match
    const existingOtp = await prisma.otp.findFirst({
      where: { otp },
    });

    if (!existingOtp) {
      console.log('check1');

      return NextResponse.json(
        { success: false, error: 'OTP verification failed' },
        { status: 400 } // Use 400 for a bad request
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
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: 'Something went wrong' },
        { status: 400 }
      );
    }
  }
}
