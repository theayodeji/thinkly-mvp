import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../contexts";
import { Theme } from "../../contexts/theme.types";
import { useUpdatePreferences } from "../../hooks/queries/useUpdatePreferences";
import { FISH_AUDIO_VOICES } from "@thinkly/shared";
import { toast } from "react-hot-toast";

import { ProfileSection } from "../../components/settings/ProfileSection";
import { AppearanceSection } from "../../components/settings/AppearanceSection";
import { StudyPreferencesSection } from "../../components/settings/StudyPreferencesSection";
import { NotificationsSection } from "../../components/settings/NotificationsSection";
import { SecuritySection } from "../../components/settings/SecuritySection";

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const updatePreferences = useUpdatePreferences();

  const [quizDifficulty, setQuizDifficulty] = useState<"beginner" | "intermediate" | "advanced">(
    user?.preferences?.quizDifficulty || "intermediate"
  );
  const [defaultVoice, setDefaultVoice] = useState(
    user?.preferences?.defaultVoice || FISH_AUDIO_VOICES[0].id
  );
  const [emailReminders, setEmailReminders] = useState(
    user?.preferences?.emailReminders ?? true
  );

  useEffect(() => {
    if (user) {
      setQuizDifficulty(user.preferences?.quizDifficulty || "intermediate");
      setDefaultVoice(user.preferences?.defaultVoice || FISH_AUDIO_VOICES[0].id);
      setEmailReminders(user.preferences?.emailReminders ?? true);
    }
  }, [user]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    updatePreferences.mutate(
      { theme: newTheme },
      {
        onSuccess: () => toast.success("Theme updated"),
        onError: () => toast.error("Failed to update theme"),
      }
    );
  };

  const handlePreferenceUpdate = (key: string, value: string | boolean) => {
    if (key === "quizDifficulty") setQuizDifficulty(value as any);
    if (key === "defaultVoice") setDefaultVoice(value as string);
    if (key === "emailReminders") setEmailReminders(value as boolean);

    updatePreferences.mutate(
      { [key]: value },
      {
        onSuccess: () => toast.success("Preference updated"),
        onError: () => toast.error("Failed to update preference"),
      }
    );
  };

  const handleLogoutAll = () => {
    toast.success("Logged out of all devices");
    logout();
  };

  return (
    <div className="wrapper max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-text-secondary mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column */}
        <div className="space-y-12">
          <ProfileSection userName={user?.name || ""} userEmail={user?.email || ""} />
          <AppearanceSection currentTheme={theme} onThemeChange={handleThemeChange} />
        </div>

        {/* Right Column */}
        <div className="space-y-12">
          <StudyPreferencesSection
            quizDifficulty={quizDifficulty}
            defaultVoice={defaultVoice}
            onPreferenceChange={handlePreferenceUpdate}
          />
          <NotificationsSection
            emailReminders={emailReminders}
            onPreferenceChange={handlePreferenceUpdate}
          />
          <SecuritySection userEmail={user?.email} onLogoutAll={handleLogoutAll} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
