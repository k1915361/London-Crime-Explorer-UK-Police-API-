
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  emoji: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, emoji }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center space-x-4">
    <div className="text-3xl bg-slate-100 dark:bg-slate-700 p-3 rounded-full">{emoji}</div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  </div>
);

export default StatCard;
