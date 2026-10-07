import React from "react";
import { Theme } from "../../contexts/theme.types";

interface AppearanceSectionProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const themes: Theme[] = ["light", "dark", "system"];

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 border-b border-border/50 pb-2">
        Appearance
      </h2>
      <div>
        <label className="block text-sm font-medium mb-3">Theme</label>
        <div className="flex flex-wrap gap-3">
          {themes.map((t) => {
            const isActive = currentTheme === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => onThemeChange(t)}
                className={`px-4 py-2 flex-1 min-w-[80px] rounded-xl border font-medium text-sm transition-colors ${
                  isActive
                    ? "bg-primary-100 text-primary-600 border-primary-500/50 dark:bg-primary-900/30 dark:text-primary-300"
                    : "border-border bg-white/50 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-black/80"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
