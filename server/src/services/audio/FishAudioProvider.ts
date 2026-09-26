import axios from "axios";
import { IAudioProvider, AudioOptions } from "@thinkly/shared";
import { AppError } from "../../utils/AppError.js";

export class FishAudioProvider implements IAudioProvider {
  async generateSpeech(text: string, options?: AudioOptions): Promise<Buffer> {
    try {
      const response = await axios.post(
        "https://api.fish.audio/v1/tts",
        {
          text,
          reference_id: options?.voiceId || process.env.HIP_MODEL_ID,
          format: "mp3",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );
      
      return Buffer.from(response.data);
    } catch (error: any) {
      console.error("Fish Audio Error:", error.response?.data?.toString() || error.message);
      throw new AppError("Failed to generate audio from Fish Audio", 500);
    }
  }
}
