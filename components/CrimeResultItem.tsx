
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
    <div className="flex items-center justify-between p-2 border-b border-zinc-200 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-sm shrink-0 w-6 text-center">{getEmojiForCrime(crimeData.crimeType)}</span>
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{crimeData.crimeType}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{crimeData.outcome}</p>
        </div>
      </div>
      <span className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
        {crimeData.count.toLocaleString()}
      </span>
    </div>
  );
};

export default CrimeResultItem;
