export interface AudioOptions {
  voiceId?: string;
}

export interface IAudioProvider {
  generateSpeech(text: string, options?: AudioOptions): Promise<Uint8Array>;
}

export interface IStorageProvider {
  uploadFile(buffer: Uint8Array, filename: string, mimeType: string): Promise<string>;
  deleteFile?(url: string): Promise<void>;
}
