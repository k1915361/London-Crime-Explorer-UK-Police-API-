
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  emoji: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, emoji }) => (
  <div className="bg-transparent p-2 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
    <div className="text-lg bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded">{emoji}</div>
    <div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
    </div>
  </div>
);

export default StatCard;
