import React from 'react';
import { useAuth } from '../../hooks/useAuth';

type ProgressItem = {
  id: string;
  icon: string;
  value: string | number;
  label: string;
};

const LearningProgress: React.FC = () => {

  const { user } = useAuth();

  const progressItems: ProgressItem[] = [
    { id: 'streak', icon: '🔥', value: user?.streaks?.current || 0, label: 'Streak' },
    { id: 'achievements', icon: '🏆', value: user?.badges?.length || 0, label: 'Achievements' },
    { id: 'medals', icon: '🏅', value: user?.badges?.length || 0, label: 'Medals' },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Learning progress - <span className="text-primary-500">Keep it going!</span></h3>
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {progressItems.map((item) => (
          <div key={item.id} className="card p-4 text-center rounded-xl bg-bg/70">
            <p className="text-sm md:text-3xl font-bold">{item.icon}</p>
            <p className="font-semibold">{item.value + (item.id ==='streak' ? item.value === 1 ? ' day' : ' days' : '')}</p>
            <p className="text-xs md:text-sm text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningProgress;
