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

    const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);

    //Delete old or expired OTPs for this email
    await prisma.otp.deleteMany({
      where: {
        email,
        OR: [{ createdAt: { lt: oneMinuteAgo } }, { email }], // Delete expired and existing OTPs
      },
    });

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

    // Send response first
    const response = NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      otp, // Remove in production
    });

    // Delete OTP in the background/ code not working on server
    // setImmediate(async () => {
    //   try {
    //     await new Promise((resolve) => setTimeout(resolve, 1 * 60 * 1000)); // Wait 1 min
    //     await prisma.otp.deleteMany({ where: { email } });
    //     console.log(`OTP deleted for ${email}`);
    //   } catch (error) {
    //     console.error('Failed to delete OTP:', error);
    //   }
    // });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to send OTP' },
        { status: 500 }
      );
    }
  }
}
