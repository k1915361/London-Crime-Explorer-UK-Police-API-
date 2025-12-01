import React from 'react';
import type { CrimeData } from '../types';
import CrimeResultItem from './CrimeResultItem';

interface ResultsDisplayProps {
  results: CrimeData[];
  isLoading: boolean;
  error: string | null;
  searchLocation: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, searchLocation }) => {
  const renderContent = () => {
    if (results.length === 0 && searchLocation) {
      return (
        <div className="text-center py-16 px-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-5xl mb-4">🤷</p>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No Results Found</h3>
          <p className="text-slate-500 dark:text-slate-400">
            No crime data was found for "{searchLocation}". Try a different or broader location.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {results.map((item, index) => (
          <CrimeResultItem key={`${item.crimeType}-${item.outcome}-${index}`} crimeData={item} />
        ))}
      </div>
    );
  };
  
  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default ResultsDisplay;