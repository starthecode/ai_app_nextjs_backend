'use server';

import prisma from '@/libs/prismaDB';

export const getallGen = async () => {
  try {
    const result = await prisma.userAiGeneratedImage.findMany();

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error:', error);
  }
};
