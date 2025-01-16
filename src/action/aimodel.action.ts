'use server';

import prisma from '@/libs/prismaDB';
import { AiModelFormParams } from '@/types';

export const createAiModel = async (data: AiModelFormParams) => {
  try {
    const result = await prisma.aiModel.create({ data });

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error:', error);
  }
};

export const getallModels = async () => {
  try {
    const result = await prisma.aiModel.findMany();

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error:', error);
  }
};

export const getsingleAiModel = async (id: string) => {
  try {
    const result = await prisma.aiModel.findUnique({
      where: { id },
    });

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error:', error);
  }
};

export const updateAiModel = async (data: AiModelFormParams) => {
  try {
    const result = await prisma.aiModel.update({
      where: { id: data.id }, // Ensure the `id` is used to locate the record
      data: {
        // Pass the fields to update
        aiModelName: data.aiModelName,
        aiModelType: data.aiModelType,
        defaultPrompt: data.defaultPrompt,
        icon: data.icon,
        name: data.name,
      },
    });

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error updating AI model:', error);
  }
};
