'use server';
import prisma from '@/libs/prismaDB';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, category } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if the email already exists
    const existingUser = await prisma.userList.findUnique({
      where: { email },
    });

    if (category == 'passwordreset') {
      if (!existingUser?.id) {
        return NextResponse.json(
          { success: false, error: 'Email Not Found' },
          { status: 400 }
        );
      }
    } else {
      if (existingUser?.id) {
        return NextResponse.json(
          { success: false, error: 'Email already register' },
          { status: 400 }
        );
      }
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
      subject:
        category === 'passwordreset'
          ? 'Password Reset - Your OTP Code'
          : 'Your OTP Code',
      html:
        category === 'passwordreset'
          ? `Your Password Reset OTP code is: ${otp}. It is valid for 1 minute.`
          : `Your OTP code is: ${otp}. It is valid for 1 minute.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Store OTP in MongoDB using Prisma
    await prisma.otp.create({
      data: {
        email,
        otp,
        category,
      },
    });

    // Send response first
    const response = NextResponse.json({
      success: true,
      message:
        category === 'passwordreset'
          ? 'Password Reset - OTP Sent on Email'
          : 'OTP Sent on Email',
    });

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
