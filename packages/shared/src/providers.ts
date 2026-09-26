export interface AudioOptions {
  voiceId?: string;
}

export interface IAudioProvider {
  generateSpeech(text: string, options?: AudioOptions): Promise<Buffer>;
}

export interface IStorageProvider {
  uploadFile(buffer: Buffer, filename: string, mimeType: string): Promise<string>;
  deleteFile?(url: string): Promise<void>;
}
