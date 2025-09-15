import React from 'react';

type ProgressItem = {
  id: string;
  icon: string;
  value: string | number;
  label: string;
};

const LearningProgress: React.FC = () => {
  const progressItems: ProgressItem[] = [
    { id: 'streak', icon: '🔥', value: '7 days', label: 'Streak' },
    { id: 'points', icon: '🏆', value: '1250', label: 'Points' },
    { id: 'medals', icon: '🏅', value: '3', label: 'Medals' },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Learning Progress</h3>
      <div className="grid grid-cols-3 gap-4">
        {progressItems.map((item) => (
          <div key={item.id} className="card p-4 text-center">
            <p className="text-3xl font-bold">{item.icon}</p>
            <p className="font-semibold">{item.value}</p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningProgress;
