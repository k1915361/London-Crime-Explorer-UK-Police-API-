import React from 'react';

const Header: React.FC = () => (
  <header className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
    <div>
      <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
        Crime Explorer
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 text-xs">
        Querying the live UK Police API with a graceful fallback to mock data
      </p>
    </div>
    <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      Live API Connected
    </div>
  </header>
);

export default Header;