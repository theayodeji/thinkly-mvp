import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "Something went wrong while loading this content.", 
  onRetry 
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 text-center bg-bg border-2 border-dashed border-red-200 dark:border-red-900/30 rounded-xl">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-bold text-text mb-2">Oops! An error occurred</h3>
      <p className="text-text-secondary mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};
