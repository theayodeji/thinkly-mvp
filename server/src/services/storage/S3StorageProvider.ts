import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { IStorageProvider } from "@thinkly/shared";
import { AppError } from "../../utils/AppError.js";

export class S3StorageProvider implements IStorageProvider {
  private client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME || "";
    
    // For R2, the endpoint looks like https://<ACCOUNT_ID>.r2.cloudflarestorage.com
    // Sometimes users accidentally copy the bucket-specific URL which includes the path /bucket-name
    let endpoint = process.env.S3_ENDPOINT;
    if (endpoint) {
      try {
        const url = new URL(endpoint);
        endpoint = url.origin; // Strips any path like /thinkly-mvp
      } catch (e) {
        // Fallback if invalid URL
      }
    }
    
    this.client = new S3Client({
      region: process.env.S3_REGION || "auto", // R2 typically uses 'auto'
      ...(endpoint && { endpoint }),
      forcePathStyle: true,
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

      // If using R2, you usually have a public dev URL or a custom domain
      if (process.env.S3_PUBLIC_URL) {
        const baseUrl = process.env.S3_PUBLIC_URL.replace(/\/+$/, "");
        return `${baseUrl}/${filename}`;
      }

      // Fallback for standard AWS S3
      return `https://${this.bucketName}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com/${filename}`;
    } catch (error: any) {
      console.error("S3 Upload Error:", error);
      throw new AppError("Failed to upload file to storage", 500);
    }
  }
}
