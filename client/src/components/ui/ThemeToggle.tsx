'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';
import { useUpdatePreferences } from '../../hooks/queries/useUpdatePreferences';
import { useAuth } from '../../hooks/useAuth';
import { Theme } from '../../contexts/theme.types';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const updatePreferences = useUpdatePreferences();
  
  const handleToggle = () => {
    let nextTheme: Theme = 'light';
    if (theme === 'light') nextTheme = 'dark';
    else if (theme === 'dark') nextTheme = 'system';
    else nextTheme = 'light';

    toggleTheme();
    if (user) {
      updatePreferences.mutate({ theme: nextTheme });
    }
  };

  const getLabel = () => {
    if (theme === 'system') return 'System Theme';
    if (theme === 'dark') return 'Dark Theme';
    return 'Light Theme';
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="h-9 w-9 rounded-full hover:bg-background-secondary transition-colors duration-200 relative group"
      aria-label={`Current: ${getLabel()}. Click to change.`}
      title={`Current: ${getLabel()} (Click to toggle)`}
    >
      {theme === 'system' ? (
        <Monitor className="h-5 w-5 text-text-secondary" />
      ) : theme === 'dark' ? (
        <Moon className="h-5 w-5 text-text-secondary" />
      ) : (
        <Sun className="h-5 w-5 text-text-secondary" />
      )}
    </Button>
  );
};

export default ThemeToggle;
