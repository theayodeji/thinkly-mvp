import { IAudioProvider, IStorageProvider } from "@thinkly/shared";
import { FishAudioProvider } from "../../audio/FishAudioProvider.js";
import { S3StorageProvider } from "../../storage/S3StorageProvider.js";
import AudioExplainer from "../../../models/AudioExplainer.js";
import geminiService from "../../../utils/genai.js";
import Space from "../../../models/Space.js";
import { AppError } from "../../../utils/AppError.js";

export class AudioExplainerService {
  private audioProvider: IAudioProvider;
  private storageProvider: IStorageProvider;

  constructor() {
    this.audioProvider = new FishAudioProvider();
    this.storageProvider = new S3StorageProvider();
  }

  async generateExplainer(userId: string, spaceId: string, concept: string, voiceId?: string) {
    // 1. Verify Space exists and belongs to user
    const space = await Space.findOne({ _id: spaceId, userId });
    if (!space) {
      throw new AppError("Space not found", 404);
    }

    // 2. Create the initial record
    const explainer = await AudioExplainer.create({
      spaceId,
      userId,
      concept,
      script: "Generating script...",
      audioUrl: "",
      voiceId: voiceId || process.env.HIP_MODEL_ID || "default",
      status: "processing",
    });

    // 3. Process asynchronously
    this.processAudioExplainer(explainer._id.toString(), concept, space.content, explainer.voiceId).catch(
      (err) => console.error(`Error processing explainer ${explainer._id}:`, err)
    );

    return explainer;
  }

  private async processAudioExplainer(explainerId: string, concept: string, context: string, voiceId: string) {
    try {
      // 1. Generate the script using Gemini
      const prompt = `You are a friendly, engaging educational podcast host. 
Your task is to write a short, highly engaging audio script explaining the concept: "${concept}".
Use the following context from the user's study space if relevant:
<context>${context}</context>

Keep the script conversational, enthusiastic, and under 150 words (about 60 seconds of speaking time). 
Do NOT include sound effects tags like [Sighs] or [Upbeat music]. Just return the spoken text.`;

      const script = await geminiService.generateContent(prompt);

      // Update script in DB
      await AudioExplainer.findByIdAndUpdate(explainerId, { script });

      // 2. Generate Audio via Provider
      const audioBuffer = await this.audioProvider.generateSpeech(script, { voiceId });

      // 3. Upload to Storage Provider
      const filename = `explainers/${explainerId}-${Date.now()}.mp3`;
      const audioUrl = await this.storageProvider.uploadFile(audioBuffer, filename, "audio/mpeg");

      // 4. Update the DB with success
      await AudioExplainer.findByIdAndUpdate(explainerId, {
        audioUrl,
        status: "ready",
      });
    } catch (error) {
      console.error("Explainer processing failed:", error);
      await AudioExplainer.findByIdAndUpdate(explainerId, { status: "error" });
    }
  }
}
