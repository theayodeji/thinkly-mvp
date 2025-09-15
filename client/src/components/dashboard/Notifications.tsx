import React from 'react';

type Notification = {
  id: string;
  icon: string;
  title: string;
  message: string;
  variant: 'info' | 'success' | 'warning' | 'default';
};

const Notifications: React.FC = () => {
  const notifications: Notification[] = [
    {
      id: 'new-feature',
      icon: '🎉',
      title: 'New Feature: AI Summaries',
      message: 'Get concise summaries of your notes with our new AI feature.',
      variant: 'info',
    },
    {
      id: 'study-tip',
      icon: '🎓',
      title: 'Study Tip',
      message: 'Try the Pomodoro technique for better focus during study sessions.',
      variant: 'default',
    },
  ];

  const variantClasses = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30',
    default: 'bg-muted/50 border-border',
  };

  const iconClasses = {
    info: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
    success: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400',
    default: 'bg-muted text-foreground',
  };

  const textClasses = {
    info: 'text-blue-800 dark:text-blue-800',
    success: 'text-green-800 dark:text-green-200',
    warning: 'text-yellow-800 dark:text-yellow-200',
    default: 'text-foreground',
  };

  const messageClasses = {
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    default: 'text-muted-foreground',
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Notifications</h3>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-4 rounded-lg border ${variantClasses[notification.variant]}`}
          >
            <div className={`p-2 rounded-full ${iconClasses[notification.variant]}`}>
              <span>{notification.icon}</span>
            </div>
            <div>
              <p className={`font-semibold ${textClasses[notification.variant]}`}>
                {notification.title}
              </p>
              <p className={`text-sm ${messageClasses[notification.variant]}`}>
                {notification.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
