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
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="flex-1">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Location (e.g., Westminster)"
          aria-label="Search location"
          className="w-full px-2 py-1 bg-transparent border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-500 transition-colors disabled:opacity-50 text-sm"
        />
      </div>

      <div className="w-full sm:w-32">
        <input
          type="month"
          value={month}
          onChange={onMonthChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          min="2021-01"
          aria-label="Select month"
          className="w-full px-2 py-1 bg-transparent border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-500 transition-colors disabled:opacity-50 text-sm [color-scheme:light] dark:[color-scheme:dark]"
        />
      </div>

      <button
        onClick={onSearch}
        disabled={disabled || !value.trim()}
        className="px-3 py-1 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};

export default SearchBar;
