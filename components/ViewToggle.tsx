import React from 'react';

type View = 'list' | 'map';

interface ViewToggleProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const buttonBaseClasses = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800";
  const activeClasses = "bg-indigo-600 text-white shadow";
  const inactiveClasses = "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600";

  return (
    <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
      <button
        onClick={() => onViewChange('list')}
        className={`${buttonBaseClasses} ${currentView === 'list' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'list'}
      >
        List 📋
      </button>
      <button
        onClick={() => onViewChange('map')}
        className={`${buttonBaseClasses} ${currentView === 'map' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'map'}
      >
        Map 🗺️
      </button>
    </div>
  );
};

export default ViewToggle;
