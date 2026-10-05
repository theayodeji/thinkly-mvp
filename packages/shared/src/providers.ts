export interface IEmailProvider {
  sendEmail(to: string, subject: string, html: string): Promise<void>;
}

export interface AudioOptions {
  voiceId?: string;
  [key: string]: any;
}

export interface IAudioProvider {
  generateSpeech(text: string, options?: AudioOptions): Promise<Uint8Array>;
}

export interface IStorageProvider {
  uploadFile(buffer: Uint8Array, filename: string, mimeType: string): Promise<string>;
}
