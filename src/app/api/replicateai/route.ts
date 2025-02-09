'use server';
import { uploadFile } from '@/libs/upload';
import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const API_KEY = process.env.API_KEY; // Define your API key in the .env file

export async function POST(request: NextRequest) {
  const aiData = await request.json();

  const authHeader = request.headers.get('authorization');

  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Invalid API Key' },
      { status: 401 }
    );
  }

  let bufferbyai: Buffer | null = null; // Initialize to null

  try {
    if (aiData?.imagePrompt || aiData?.inputPrompt) {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      });

      const main_face_image = `data:application/octet-stream;base64,${aiData?.imagePrompt}`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const outputStream: any = await replicate.run(aiData?.aiModelName, {
        input: {
          prompt: aiData?.inputPrompt + ' ' + aiData?.defaultPrompt,
          main_face_image: main_face_image,
          image: main_face_image,
        },
      });

      // Iterate over the output and handle the ReadableStream
      if (aiData?.name === 'BG Remover') {
        if (outputStream instanceof ReadableStream) {
          bufferbyai = await streamToBuffer(outputStream);
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [index, item] of Object.entries(outputStream)) {
          if (!(item instanceof ReadableStream)) {
            throw new Error('Expected a ReadableStream from Replicate output');
          }
          bufferbyai = await streamToBuffer(item);
        }
      }

      const data: never[] = [];

      if (!bufferbyai) {
        throw new Error('bufferbyai was not assigned a value.');
      }

      const aiResponse = await uploadFile(data, bufferbyai);

      return Response.json({ result: aiResponse });
    }

    // Return the uploaded file information
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error during replicate api:', error);
    return Response.json({ Error: error.message });
  }
}

/**
 * Helper function to convert a ReadableStream to a Buffer.
 */
async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const { value, done: isDone } = await reader.read();
    if (value) chunks.push(value);
    done = isDone;
  }

  return Buffer.concat(chunks);
}
