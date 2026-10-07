import { IAudioProvider, IStorageProvider, FISH_AUDIO_VOICES } from "@thinkly/shared";
import { FishAudioProvider } from "../../audio/FishAudioProvider.js";
import { S3StorageProvider } from "../../storage/S3StorageProvider.js";
import AudioExplainer from "../../../models/AudioExplainer.js";
import geminiService from "../../../utils/genai.js";
import Space from "../../../models/Space.js";
import Source from "../../../models/Source.js";
import { AppError } from "../../../utils/AppError.js";
import { logger } from "../../../utils/logger.js";
import { eventStreamManager } from "../../../utils/eventStreamManager.js";

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
    
    // Fetch sources to include in context
    const sources = await Source.find({ spaceId });
    const sourcesContext = sources.map(s => s.text).join('\n\n');
    
    const contentContext = [
        space.content ? `Space Overview: ${space.content}` : '',
        sourcesContext ? `Source Materials:\n${sourcesContext}` : ''
    ].filter(Boolean).join('\n\n');

    if (!contentContext) {
      throw new AppError("Cannot generate explainer: No content or sources found in this space", 400);
    }

    // 2. Create the initial record
    const explainer = await AudioExplainer.create({
      spaceId,
      userId,
      concept,
      script: "Generating script...",
      audioUrl: "",
      voiceId: voiceId || FISH_AUDIO_VOICES[0].id,
      status: "processing",
    });

    // 3. Process asynchronously
    this.processAudioExplainer(explainer._id.toString(), concept, contentContext, explainer.voiceId).catch(
      (err) => logger.error(`[AudioExplainer] Error processing explainer ${explainer._id}: ${err}`)
    );

    return explainer;
  }

  async retryExplainer(userId: string, explainerId: string) {
    const explainer = await AudioExplainer.findOne({ _id: explainerId, userId });
    if (!explainer) {
      throw new AppError("Explainer not found", 404);
    }

    if (explainer.status !== "error") {
      throw new AppError("Only failed explainers can be retried", 400);
    }

    const space = await Space.findOne({ _id: explainer.spaceId, userId });
    if (!space) {
      throw new AppError("Space not found", 404);
    }

    const sources = await Source.find({ spaceId: explainer.spaceId });
    const sourcesContext = sources.map(s => s.text).join('\n\n');

    const contentContext = [
        space.content ? `Space Overview: ${space.content}` : '',
        sourcesContext ? `Source Materials:\n${sourcesContext}` : ''
    ].filter(Boolean).join('\n\n');

    if (!contentContext) {
      throw new AppError("Cannot retry explainer: No content or sources found in this space", 400);
    }

    explainer.status = "processing";
    explainer.script = "Generating script...";
    explainer.audioUrl = "";
    await explainer.save();

    this.processAudioExplainer(explainer._id.toString(), explainer.concept, contentContext, explainer.voiceId).catch(
      (err) => logger.error(`[AudioExplainer] Error processing explainer ${explainer._id}: ${err}`)
    );

    return explainer;
  }

  private async processAudioExplainer(explainerId: string, concept: string, context: string, voiceId: string) {
    try {
      logger.debug(`[AudioExplainer] Started processing script for ${explainerId}`);
      // 1. Generate the script using Gemini
      const prompt = `You are a friendly, highly expressive, and reassuring tutor. 
Your task is to write an engaging audio script explaining the concept: "${concept}".

Important instructions for the script:
1. NO MARKDOWN: This script is for a Text-to-Speech engine. Do NOT use ANY markdown formatting (no asterisks **, no hashes #, no italics, no bullet points). The engine will literally pronounce the word "asterisk"! Use only plain text and punctuation.
2. Start with a fun intro or something interesting to hook the listener or at least get them invested in the topic.
3. Explain the concept clearly, simply, and conversationally, the goal is to make the listener feel like they're having a conversation with a friend who's teaching them.
4. Aim for about 200-250 words (roughly 1 minute and 30 seconds of speaking time).
5. INJECT EMOTION & PACING: You MUST use Fish Audio inline bracket tags to make the delivery sound vibrant, human, and expressive. 
   Supported tags you should heavily use:
   - Core Emotions: [excited], [sympathetic], [determined], [bored]
   - Tone Delivery: [whispering], [soft tone], [shouting], [in a hurry tone]
   - Human Sounds: [laughing], [chuckling], [sighing], [gasping], [clear throat], [sobbing]
   - Pacing Control: [pause], [long pause]
   - Emphasis: Place [emphasis] immediately before a word to punch it.
   Example: "[excited] Oh wow, I love this topic! [pause] [whispering] But here is the [emphasis] real secret... [chuckling]"
6. Do NOT include speaker labels (like "Tutor:"). Just return the plain spoken text with emotion tags.

Use the following context from the user's study space if relevant:
<context>${context}</context>`;

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

      // 4. Update the DB with success and emit SSE event
      const updated = await AudioExplainer.findByIdAndUpdate(
        explainerId,
        { audioUrl, status: "ready" },
        { new: true }
      );
      logger.debug(`[AudioExplainer] Explainer ${explainerId} is ready!`);

      if (updated) {
        eventStreamManager.sendToUser(updated.userId.toString(), "explainer:updated", {
          spaceId: updated.spaceId.toString(),
          explainerId: updated._id.toString(),
          status: "ready",
          audioUrl: updated.audioUrl,
        });
      }
    } catch (error) {
      logger.error(`[AudioExplainer] Processing failed for ${explainerId}: ${error}`);
      const failed = await AudioExplainer.findByIdAndUpdate(
        explainerId,
        { status: "error" },
        { new: true }
      );
      if (failed) {
        eventStreamManager.sendToUser(failed.userId.toString(), "explainer:updated", {
          spaceId: failed.spaceId.toString(),
          explainerId: failed._id.toString(),
          status: "error",
        });
      }
    }
  }
}
