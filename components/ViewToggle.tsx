import React from 'react';

type View = 'list' | 'map';

interface ViewToggleProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex gap-1">
      <button
        onClick={() => onViewChange('list')}
        className={`px-2 py-1 text-xs transition-colors ${currentView === 'list'
            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        aria-pressed={currentView === 'list'}
        aria-label="Show list view"
      >
        List
      </button>
      <button
        onClick={() => onViewChange('map')}
        className={`px-2 py-1 text-xs transition-colors ${currentView === 'map'
            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        aria-pressed={currentView === 'map'}
        aria-label="Show map view"
      >
        Map
      </button>
    </div>
  );
};

export default ViewToggle;
