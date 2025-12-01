import React from 'react';

const Header: React.FC = () => (
  <header className="text-center mb-8">
    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-2 pb-2">
      London Crime Explorer
    </h1>
    <p className="text-lg text-slate-600 dark:text-slate-400">
      Querying the live UK Police API with a graceful fallback to mock data 🧠
    </p>
  </header>
);

export default Header;