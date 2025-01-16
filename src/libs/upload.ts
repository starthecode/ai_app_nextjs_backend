'use server';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import { generateRandomHex } from './generateRandomHex';

export const uploadFile = async (data: FormData) => {
  try {
    const S3_BUCKET = 'cdk-hnb659fds-assets-305383907906-us-west-1'; // Replace with your bucket name
    const REGION = 'us-west-1'; // Replace with your region

    // Securely fetch credentials using environment variables
    AWS.config.update({
      accessKeyId: process.env.AMZ_CLIENT_ID,
      secretAccessKey: process.env.AWZ_SECRET_ID,
    });

    const s3 = new S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
      signatureVersion: 'v4',
    });

    // Extract file data from FormData
    const fileEntry = data.get('icon') as File;
    if (!fileEntry) {
      throw new Error('No file provided in the FormData');
    }

    // Read the file as a buffer
    const bufferData = Buffer.from(await fileEntry.arrayBuffer());

    // Determine MIME type
    const getMimeType = (buffer: Buffer) => {
      const hex = buffer.toString('hex', 0, 4);

      console.log('hex', hex);

      switch (hex) {
        case '89504e47':
          return 'image/png';
        case 'ffd8ffe0':
        case 'ffd8ffdb':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
          return 'image/jpeg';
        case '52494646':
          return 'image/webp';
        default:
          throw new Error('Unsupported file type');
      }
    };

    const randomHex = generateRandomHex(16);
    const mimeType = getMimeType(bufferData);
    const fileExtension = mimeType.split('/')[1];
    const fileName = `${randomHex}.${fileExtension}`;

    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Body: bufferData,
      ACL: 'public-read',
      ContentType: mimeType,
    };

    // Upload file to S3
    await s3.putObject(params).promise();
    const fileUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
    return fileUrl;
  } catch (error) {
    console.error('Unexpected error during upload:', error);
    throw error; // Propagate the error for better error handling
  }
};
