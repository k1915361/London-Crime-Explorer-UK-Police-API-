import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { CrimeData } from '../types';
import CrimeResultItem from './CrimeResultItem';

interface ResultsDisplayProps {
  results: CrimeData[];
  isLoading: boolean;
  error: string | null;
  searchLocation: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, searchLocation }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: results.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 90, // Estimated height of CrimeResultItem + padding
    overscan: 5,
  });

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
      <div 
        ref={parentRef} 
        className="h-[600px] overflow-auto pr-2"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = results[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                  paddingBottom: '0.75rem', // space-y-3 equivalent
                }}
              >
                <CrimeResultItem crimeData={item} />
              </div>
            );
          })}
        </div>
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