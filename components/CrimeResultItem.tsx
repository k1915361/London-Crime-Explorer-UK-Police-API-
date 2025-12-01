
import React from 'react';
import type { CrimeData } from '../types';

interface CrimeResultItemProps {
  crimeData: CrimeData;
}

const getEmojiForCrime = (crimeType: string): string => {
  const lowerCaseType = crimeType.toLowerCase();
  if (lowerCaseType.includes('violence') || lowerCaseType.includes('sexual')) return '💥';
  if (lowerCaseType.includes('burglary')) return '🏠';
  if (lowerCaseType.includes('vehicle')) return '🚗';
  if (lowerCaseType.includes('anti-social')) return '🗣️';
  if (lowerCaseType.includes('theft')) return '💸';
  if (lowerCaseType.includes('robbery')) return '💰';
  if (lowerCaseType.includes('drugs')) return '💊';
  if (lowerCaseType.includes('public order')) return '📢';
  return '🚨';
};

const CrimeResultItem: React.FC<CrimeResultItemProps> = ({ crimeData }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 border-l-4 border-indigo-500 hover:shadow-md">
      <div className="flex items-center space-x-4">
        <span className="text-3xl">{getEmojiForCrime(crimeData.crimeType)}</span>
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{crimeData.crimeType}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Outcome: {crimeData.outcome}</p>
        </div>
      </div>
      <span className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-3 py-1 rounded-full">
        {crimeData.count.toLocaleString()}
      </span>
    </div>
  );
};

export default CrimeResultItem;
