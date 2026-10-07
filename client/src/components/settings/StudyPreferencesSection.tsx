import React from "react";
import { FISH_AUDIO_VOICES } from "@thinkly/shared";

interface StudyPreferencesSectionProps {
  quizDifficulty: "beginner" | "intermediate" | "advanced";
  defaultVoice: string;
  onPreferenceChange: (key: string, value: string) => void;
}

export const StudyPreferencesSection: React.FC<StudyPreferencesSectionProps> = ({
  quizDifficulty,
  defaultVoice,
  onPreferenceChange,
}) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 border-b border-border/50 pb-2">
        Study Preferences
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Quiz Difficulty</label>
          <p className="text-xs text-text-secondary mb-2">
            This setting ONLY applies to Quizzes.
          </p>
          <select
            value={quizDifficulty}
            onChange={(e) => onPreferenceChange("quizDifficulty", e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-black/50 border border-border outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Default Audio Explainer Voice
          </label>
          <select
            value={defaultVoice}
            onChange={(e) => onPreferenceChange("defaultVoice", e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-black/50 border border-border outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            {FISH_AUDIO_VOICES.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name} - {voice.description}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};
