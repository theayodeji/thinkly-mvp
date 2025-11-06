import React from 'react';
import { motion } from 'framer-motion';

export const WorkInProgress = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <img 
          src="/working-on-it.svg" 
          alt="Working on it"
          className="w-48 h-48 mx-auto"
        />
      </motion.div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Working on it!</h2>
      <p className="text-text-secondary max-w-md">
        This feature is still in development. We're working hard to bring it to you as soon as possible. 
        Stay tuned for updates!
      </p>
    </div>
  );
};

import QuizDrawer from './ui/Drawer';

export const WorkInProgressDrawer = ({ 
  trigger, 
  title = "Coming Soon" 
}: { 
  trigger: React.ReactNode;
  title?: string;
}) => {
  return (
    <QuizDrawer trigger={trigger} title={title}>
      <WorkInProgress />
    </QuizDrawer>
  );
};
