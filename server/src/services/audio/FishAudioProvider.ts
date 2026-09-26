import axios from "axios";
import { IAudioProvider, AudioOptions } from "@thinkly/shared";
import { AppError } from "../../utils/AppError.js";

export class FishAudioProvider implements IAudioProvider {
  async generateSpeech(text: string, options?: AudioOptions): Promise<Uint8Array> {
    try {
      const payload: any = {
        text,
        format: "mp3",
      };

      const refId = options?.voiceId || process.env.HIP_MODEL_ID;
      if (refId && refId !== "default") {
        payload.reference_id = refId;
      }

      const response = await axios.post(
        "https://api.fish.audio/v1/tts",
        payload,
        {
          headers: {
            Authorization: `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
            "Content-Type": "application/json",
            // The Fish Audio v1 API often expects the model via headers or body
            // We'll pass it in headers as standard documentation suggests.
            // If they are on a paid plan, s2-pro or whatever is valid. 
            // Often "FishAudio" doesn't strictly require it if fallback handles it, 
            // but we'll include it just in case! 
            "model": "s2.1-pro-free"
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
