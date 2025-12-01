import React from 'react';

interface FallbackBannerProps {
  isFallback: boolean;
  error: string | null;
}

const FallbackBanner: React.FC<FallbackBannerProps> = ({ isFallback, error }) => {
  if (!isFallback) {
    return null;
  }

  return (
    <div className="mb-8 p-4 bg-amber-100 dark:bg-amber-900/50 border-l-4 border-amber-500 text-amber-800 dark:text-amber-200 rounded-lg shadow-md" role="alert">
      <p className="font-bold text-lg">⚠️ Using Fallback Data</p>
      <p>The live UK Police API could not be reached, so we've loaded a local mock dataset for demonstration.</p>
      {error && (
        <p className="mt-2 text-sm font-mono bg-amber-200 dark:bg-amber-800/50 p-2 rounded">
          <strong>Reason:</strong> {error}
        </p>
      )}
    </div>
  );
};

export default FallbackBanner;
