'use server';
import prisma from '@/libs/prismaDB';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if the email already exists
    const existingUser = await prisma.userList.findUnique({
      where: { email },
    });

    if (existingUser?.id) {
      return NextResponse.json(
        { success: false, error: 'Email already register' },
        { status: 400 }
      );
    }

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const transporter = nodemailer.createTransport({
      service: 'Outlook365',

      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW, // Change 'PASS' to 'pass'
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Your OTP Code',
      html: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Store OTP in MongoDB using Prisma
    await prisma.otp.create({
      data: {
        email,
        otp,
      },
    });

    // Automatically delete OTP after 3 minutes
    setTimeout(async () => {
      await prisma.otp.deleteMany({
        where: { email },
      });
    }, 1 * 60 * 1000); // 1 minutes

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      otp,
    }); // Remove `otp` from response in production
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to send OTP' },
        { status: 500 }
      );
    }
  }
}
