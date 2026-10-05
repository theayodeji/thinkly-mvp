import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../contexts";
import { Theme } from "../../contexts/theme.types";
import { useUpdatePreferences } from "../../hooks/queries/useUpdatePreferences";
import { FISH_AUDIO_VOICES, OTPType } from "@thinkly/shared";
import { authService } from "../../shared/services/authService";
import { OTPVerificationModal } from "../../components/auth/OTPVerificationModal";
import toast from "react-hot-toast";

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const updatePreferences = useUpdatePreferences();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [quizDifficulty, setQuizDifficulty] = useState<"beginner" | "intermediate" | "advanced">(user?.preferences?.quizDifficulty || "intermediate");
  const [defaultVoice, setDefaultVoice] = useState(user?.preferences?.defaultVoice || FISH_AUDIO_VOICES[0].id);
  const [emailReminders, setEmailReminders] = useState(user?.preferences?.emailReminders ?? true);

  // Security / Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setQuizDifficulty(user.preferences?.quizDifficulty || "intermediate");
      setDefaultVoice(user.preferences?.defaultVoice || FISH_AUDIO_VOICES[0].id);
      setEmailReminders(user.preferences?.emailReminders ?? true);
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully (Mocked)");
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    updatePreferences.mutate({ theme: newTheme }, {
      onSuccess: () => toast.success("Theme updated"),
      onError: () => toast.error("Failed to update theme")
    });
  };

  const handlePreferenceUpdate = (key: string, value: string | boolean) => {
    updatePreferences.mutate({ [key]: value }, {
      onSuccess: () => toast.success("Preference updated"),
      onError: () => toast.error("Failed to update preference")
    });
  };

  const handleRequestOtpForPassword = async () => {
    if (!user?.email) return;
    try {
      setIsSendingOtp(true);
      await authService.sendOTP(user.email, OTPType.SECURITY_ACTION);
      toast.success("Verification code sent to your email!");
      setShowOtpModal(true);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to send code";
      toast.error(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsChangingPassword(true);
      await authService.changePassword({ currentPassword, newPassword });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to change password";
      toast.error(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleVerifyOtpForPasswordChange = async (otp: string) => {
    try {
      setIsChangingPassword(true);
      await authService.changePassword({ newPassword, otp });
      toast.success("Password changed successfully using verification code!");
      setShowOtpModal(false);
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to verify code";
      toast.error(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutAll = () => {
    toast.success("Logged out of all devices");
    logout();
  };

  return (
    <div className="wrapper max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-text-secondary mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column */}
        <div className="space-y-12">
          {/* Profile Settings */}
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b border-border/50 pb-2">Profile Settings</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-black/50 border border-border outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="w-full px-4 py-2 rounded-xl bg-white/20 dark:bg-black/20 border border-border opacity-75 outline-none cursor-not-allowed"
                />
              </div>
              <button type="submit" className="btn-3d-primary mt-2">
                Save Profile
              </button>
            </form>
          </section>

          {/* Appearance */}
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b border-border/50 pb-2">Appearance</h2>
            <div>
              <label className="block text-sm font-medium mb-3">Theme</label>
              <div className="flex flex-wrap gap-3">
                {(["light", "dark", "system"] as Theme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`px-4 py-2 flex-1 min-w-[80px] rounded-xl border ${theme === t ? 'border-primary-500 bg-primary-100 text-primary-600 dark:bg-primary-900/30' : 'border-border bg-white/50 dark:bg-black/50'}`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-12">
          {/* Study Preferences */}
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b border-border/50 pb-2">Study Preferences</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Quiz Difficulty</label>
                <p className="text-xs text-text-secondary mb-2">This setting ONLY applies to Quizzes.</p>
                <select 
                  value={quizDifficulty}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setQuizDifficulty(val);
                    handlePreferenceUpdate("quizDifficulty", val);
                  }}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-black/50 border border-border outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Default Audio Explainer Voice</label>
                <select 
                  value={defaultVoice}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDefaultVoice(val);
                    handlePreferenceUpdate("defaultVoice", val);
                  }}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-black/50 border border-border outline-none focus:ring-2 focus:ring-primary-500"
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

          {/* Notifications */}
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b border-border/50 pb-2">Notifications</h2>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="emailReminders"
                checked={emailReminders}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setEmailReminders(checked);
                  handlePreferenceUpdate("emailReminders", checked);
                }}
                className="w-5 h-5 accent-primary-500 rounded cursor-pointer"
              />
              <label htmlFor="emailReminders" className="text-sm font-medium cursor-pointer">
                Email Reminders
              </label>
            </div>
          </section>

          {/* Security */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-danger mb-4 border-b border-danger/20 pb-2">Security</h2>
            
            {/* Change Password Form */}
            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Change Password</h3>
              <div>
                <label className="block text-xs font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-black/50 border border-border outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-black/50 border border-border outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-black/50 border border-border outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword || !newPassword}
                  className="px-4 py-2 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 disabled:opacity-50 transition-colors"
                >
                  {isChangingPassword ? "Saving..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={handleRequestOtpForPassword}
                  disabled={isSendingOtp || !newPassword}
                  className="px-4 py-2 rounded-xl border border-primary-500 text-primary-500 font-semibold text-sm hover:bg-primary-50 dark:hover:bg-primary-950/30 disabled:opacity-50 transition-colors"
                >
                  {isSendingOtp ? "Sending Code..." : "Verify via Email OTP"}
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-border/50">
              <button 
                onClick={handleLogoutAll}
                className="px-5 py-2.5 rounded-xl border border-danger text-danger hover:bg-danger/10 transition-colors font-medium w-full sm:w-auto text-sm"
              >
                Log out of all devices
              </button>
            </div>
          </section>
        </div>

      </div>

      {user?.email && (
        <OTPVerificationModal
          isOpen={showOtpModal}
          email={user.email}
          type={OTPType.SECURITY_ACTION}
          title="Verify Security Action"
          description="Enter the 6-digit code sent to your email to confirm changing your password."
          onVerify={handleVerifyOtpForPasswordChange}
          onClose={() => setShowOtpModal(false)}
          isLoading={isChangingPassword}
        />
      )}
    </div>
  );
};

export default Settings;
