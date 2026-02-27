import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  month: string;
  onMonthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, month, onMonthChange, onSearch, isLoading, disabled }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };
  
  return (
    <div className="sticky top-4 z-10">
    <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter Location (e.g., 'Mayfair, London')"
        className="flex-grow p-3 text-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:opacity-50"
        disabled={disabled}
      />
      <input
        type="month"
        value={month}
        onChange={onMonthChange}
        onKeyDown={handleKeyDown}
        min="2021-01"
        max="2024-12"
        className="p-3 text-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:opacity-50"
        disabled={disabled}
      />
      <button
        onClick={onSearch}
        disabled={disabled}
        className="px-6 py-3 bg-indigo-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-400 disabled:dark:bg-indigo-800 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Querying...
          </>
        ) : (
          'Search 🔎'
        )}
      </button>
    </div>
    </div>
  );
};

export default SearchBar;
