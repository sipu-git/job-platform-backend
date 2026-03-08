import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import Multer from 'multer';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadResumeToS3(file: Express.Multer.File) {

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `resumes/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${uploadParams.Key}`;
}

export async function uploadAvtar(file:Express.Multer.File){
  const key = `profiles/${Date.now()}-${file.originalname}`
  await s3.send(
    new PutObjectCommand({
      Bucket:process.env.AWS_BUCKET_NAME!,
      Key:key,
      Body:file.buffer,
      ContentType:file.mimetype
    })
  )
  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}