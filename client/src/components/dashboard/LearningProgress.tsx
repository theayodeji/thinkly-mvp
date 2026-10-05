import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Flame, Trophy, Medal } from 'lucide-react';

const LearningProgress: React.FC = () => {
  const { user } = useAuth();

  const progressItems = [
    { 
      id: 'streak', 
      icon: <Flame className="h-6 w-6 text-red-500" />, 
      value: user?.streaks?.current || 0, 
      label: 'Current Streak',
      valueSuffix: user?.streaks?.current === 1 ? ' day' : ' days'
    },
    { 
      id: 'achievements', 
      icon: <Trophy className="h-6 w-6 text-amber-500" />, 
      value: user?.badges?.length || 0, 
      label: 'Achievements',
      valueSuffix: ''
    }
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">
        Learning progress
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {progressItems.map((item) => (
          <div key={item.id} className="p-6 text-center glass-panel flex flex-col items-center justify-center gap-3">
            <div className={`p-4 rounded-full bg-bg border border-border/50`}>
              {item.icon}
            </div>
            <div>
              <p className="font-bold text-lg">{item.value}{item.valueSuffix}</p>
              <p className="text-sm text-text-secondary">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningProgress;
