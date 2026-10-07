import React from "react";

interface NotificationsSectionProps {
  emailReminders: boolean;
  onPreferenceChange: (key: string, value: boolean) => void;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  emailReminders,
  onPreferenceChange,
}) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 border-b border-border/50 pb-2">
        Notifications
      </h2>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="emailReminders"
          checked={emailReminders}
          onChange={(e) => onPreferenceChange("emailReminders", e.target.checked)}
          className="w-5 h-5 accent-primary-500 rounded cursor-pointer"
        />
        <label htmlFor="emailReminders" className="text-sm font-medium cursor-pointer select-none">
          Email Reminders
        </label>
      </div>
    </section>
  );
};
