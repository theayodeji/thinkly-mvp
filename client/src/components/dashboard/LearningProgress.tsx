import React from 'react';

type ProgressItem = {
  id: string;
  icon: string;
  value: string | number;
  label: string;
};

const LearningProgress: React.FC = () => {
  const progressItems: ProgressItem[] = [
    { id: 'streak', icon: '🔥', value: '5 days', label: 'Streak' },
    { id: 'achievements', icon: '🏆', value: '12', label: 'Achievements' },
    { id: 'medals', icon: '🏅', value: '3', label: 'Medals' },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Learning progress - <span className="text-primary-500">Keep it going!</span></h3>
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {progressItems.map((item) => (
          <div key={item.id} className="card p-4 text-center rounded-xl bg-bg/70">
            <p className="text-sm md:text-3xl font-bold">{item.icon}</p>
            <p className="font-semibold">{item.value}</p>
            <p className="text-xs md:text-sm text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningProgress;
