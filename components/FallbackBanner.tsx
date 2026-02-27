import React from 'react';
import { AlertTriangle, WifiOff, MapPinOff, Clock, ServerCrash } from 'lucide-react';

interface FallbackBannerProps {
  isFallback: boolean;
  error: string | null;
}

const FallbackBanner: React.FC<FallbackBannerProps> = ({ isFallback, error }) => {
  if (!isFallback) {
    return null;
  }

  // Determine the specific error type based on the error message
  let errorTitle = "Using Fallback Data";
  let errorDescription = "The live UK Police API could not be reached, so we've loaded a local mock dataset for demonstration.";
  let ErrorIcon = AlertTriangle;

  if (error) {
    const lowerError = error.toLowerCase();
    if (lowerError.includes('location not found') || lowerError.includes('geocoding failed')) {
      errorTitle = "Location Not Found";
      errorDescription = "We couldn't find coordinates for that location. We've loaded a mock dataset instead.";
      ErrorIcon = MapPinOff;
    } else if (lowerError.includes('failed to fetch') || lowerError.includes('network error') || lowerError.includes('offline')) {
      errorTitle = "Network Offline";
      errorDescription = "You appear to be offline or the network request was blocked. We've loaded a mock dataset instead.";
      ErrorIcon = WifiOff;
    } else if (lowerError.includes('status 429') || lowerError.includes('rate limit')) {
      errorTitle = "API Rate Limited";
      errorDescription = "We've made too many requests to the UK Police API. We've loaded a mock dataset instead.";
      ErrorIcon = Clock;
    } else if (lowerError.includes('status 5') || lowerError.includes('internal server error')) {
      errorTitle = "API Server Error";
      errorDescription = "The UK Police API is currently experiencing issues. We've loaded a mock dataset instead.";
      ErrorIcon = ServerCrash;
    }
  }

  return (
    <div className="mb-8 p-4 bg-amber-100 dark:bg-amber-900/50 border-l-4 border-amber-500 text-amber-800 dark:text-amber-200 rounded-lg shadow-md" role="alert">
      <div className="flex items-center gap-2 mb-2">
        <ErrorIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        <p className="font-bold text-lg">{errorTitle}</p>
      </div>
      <p>{errorDescription}</p>
      {error && (
        <div className="mt-3 text-sm font-mono bg-amber-200 dark:bg-amber-800/50 p-3 rounded overflow-x-auto">
          <strong className="text-amber-900 dark:text-amber-100 block mb-1">Technical Details:</strong> 
          <span className="opacity-80">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FallbackBanner;
