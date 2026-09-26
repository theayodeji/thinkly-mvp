import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { IStorageProvider } from "@thinkly/shared";
import { AppError } from "../../utils/AppError.js";

export class S3StorageProvider implements IStorageProvider {
  private client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME || "";
    this.client = new S3Client({
      region: process.env.S3_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }

  async uploadFile(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
    try {
      if (!this.bucketName) {
        throw new Error("S3_BUCKET_NAME is not configured");
      }

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: buffer,
        ContentType: mimeType,
      });

      await this.client.send(command);

      // Return the public URL. Assumes the bucket is public or a CDN is configured.
      // E.g. https://my-bucket.s3.amazonaws.com/filename.mp3
      return `https://${this.bucketName}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com/${filename}`;
    } catch (error: any) {
      console.error("S3 Upload Error:", error);
      throw new AppError("Failed to upload file to storage", 500);
    }
  }
}
