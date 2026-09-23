import React from 'react';
import { Sparkles, Lightbulb } from 'lucide-react';

const Notifications: React.FC = () => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Notifications</h3>
      <div className="space-y-4">
        {/* Notification 1 */}
        <div className="flex items-start gap-4 p-5 rounded-xl border border-primary-200 bg-primary-50 dark:bg-primary-900/10 dark:border-primary-800/30">
          <Sparkles className="h-6 w-6 text-primary-600 dark:text-primary-400 mt-1 shrink-0" />
          <div>
            <p className="font-bold text-primary-800 dark:text-primary-300 mb-1">
              New Feature: AI Summaries
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Get concise summaries of your notes with our new AI feature. Study smarter, not harder.
            </p>
          </div>
        </div>

        {/* Notification 2 */}
        <div className="flex items-start gap-4 p-5 rounded-xl border border-border/60 bg-bg shadow-sm">
          <Lightbulb className="h-6 w-6 text-amber-500 mt-1 shrink-0" />
          <div>
            <p className="font-bold text-text mb-1">
              Study Tip
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Try the Pomodoro technique for better focus during long study sessions. Breaks are vital.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
