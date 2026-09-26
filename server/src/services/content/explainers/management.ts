import { IAudioProvider, IStorageProvider } from "@thinkly/shared";
import { FishAudioProvider } from "../../audio/FishAudioProvider.js";
import { S3StorageProvider } from "../../storage/S3StorageProvider.js";
import AudioExplainer from "../../../models/AudioExplainer.js";
import geminiService from "../../../utils/genai.js";
import Space from "../../../models/Space.js";
import { AppError } from "../../../utils/AppError.js";
import { logger } from "../../../utils/logger.js";

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
      (err) => logger.error(`[AudioExplainer] Error processing explainer ${explainer._id}: ${err}`)
    );

    return explainer;
  }

  private async processAudioExplainer(explainerId: string, concept: string, context: string, voiceId: string) {
    try {
      logger.debug(`[AudioExplainer] Started processing script for ${explainerId}`);
      // 1. Generate the script using Gemini
      const prompt = `You are a friendly, encouraging, and reassuring tutor. 
Your task is to write an audio script explaining the concept: "${concept}".

Important instructions for the script:
1. Start with an encouraging and reassuring tone to build the student's confidence before diving into the explanation.
2. Explain the concept clearly and simply.
3. Use the following context from the user's study space if relevant:
<context>${context}</context>
4. Keep the script conversational and aim for about 200-250 words (roughly 1 minute and 30 seconds of speaking time).
5. You CAN and SHOULD use Fish Audio emotion tags in square brackets to make the delivery sound human and expressive.
   Examples: [laugh], [sigh], [whispering], [excited], [soft voice], [voice breaking]. 
   Place these anywhere in the sentence to control the tone! Do NOT include speaker labels like "Speaker 1:".`;

      const script = await geminiService.generateContent(prompt);
      
      logger.debug(`[AudioExplainer] Script generated successfully for ${explainerId}`);

      // Update script in DB
      await AudioExplainer.findByIdAndUpdate(explainerId, { script });

      logger.debug(`[AudioExplainer] Generating audio via Fish Audio for ${explainerId}`);
      // 2. Generate Audio via Provider
      const audioBuffer = await this.audioProvider.generateSpeech(script, { voiceId });

      logger.debug(`[AudioExplainer] Uploading audio to storage for ${explainerId}`);
      // 3. Upload to Storage Provider
      const filename = `explainers/${explainerId}-${Date.now()}.mp3`;
      const audioUrl = await this.storageProvider.uploadFile(audioBuffer, filename, "audio/mpeg");

      logger.debug(`[AudioExplainer] Audio uploaded successfully. URL: ${audioUrl}`);

      // 4. Update the DB with success
      await AudioExplainer.findByIdAndUpdate(explainerId, {
        audioUrl,
        status: "ready",
      });
      logger.debug(`[AudioExplainer] Explainer ${explainerId} is ready!`);
    } catch (error) {
      logger.error(`[AudioExplainer] Processing failed for ${explainerId}: ${error}`);
      await AudioExplainer.findByIdAndUpdate(explainerId, { status: "error" });
    }
  }
}
