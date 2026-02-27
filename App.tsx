import React, { useState, useEffect, useCallback } from 'react';
import type { CrimeData, ApiCrimeRecord } from './types';
import { CrimeDB } from './services/databaseService';
import { fetchCrimeData } from './services/apiService';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ResultsDisplay from './components/ResultsDisplay';
import StatCard from './components/StatCard';
import Loader from './components/Loader';
import FallbackBanner from './components/FallbackBanner';
import MapDisplay from './components/MapDisplay';
import ViewToggle from './components/ViewToggle';
import { useUrlState } from './hooks/useUrlState';

const App: React.FC = () => {
  const [results, setResults] = useState<CrimeData[]>([]);
  const [rawCrimeData, setRawCrimeData] = useState<ApiCrimeRecord[]>([]);
  const [searchLocation, setSearchLocation] = useUrlState<string>('location', 'Westminster, London');
  const [searchDate, setSearchDate] = useUrlState<string>('date', '2024-04');
  const [inputValue, setInputValue] = useState<string>(searchLocation);
  const [inputDate, setInputDate] = useState<string>(searchDate);
  const [isQueryLoading, setIsQueryLoading] = useState<boolean>(true);
  const [queryError, setQueryError] = useState<string | null>(null);

  const [totalRows, setTotalRows] = useState<number>(0);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [view, setView] = useUrlState<'list' | 'map'>('view', 'list');
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.5074, -0.1278]); // Default to London

  const [queryEngine, setQueryEngine] = useState<string>('Initializing...');

  // Sync input value if URL changes via back/forward
  useEffect(() => {
    setInputValue(searchLocation);
    setInputDate(searchDate);
  }, [searchLocation, searchDate]);

  const executeSearch = useCallback(async (location: string, date: string) => {
    if (!location.trim()) {
        setResults([]);
        setRawCrimeData([]);
        setTotalRows(0);
        return;
    }

    setIsQueryLoading(true);
    setQueryError(null);
    setApiError(null);
    setIsFallback(false);

    try {
      const { data, isFallback: fallbackStatus, error: fetchError, center } = await fetchCrimeData(location, date);
      
      setRawCrimeData(data);
      setIsFallback(fallbackStatus);
      setApiError(fetchError);
      if (center) {
        setMapCenter([center.lat, center.lon]);
      }
      
      const db = new CrimeDB(data);
      setTotalRows(db.getTotalRows());

      const { results: aggregatedData, engine } = await db.getAggregatedData();
      setResults(aggregatedData);
      setQueryEngine(engine);

    } catch (e: unknown) {
      console.error("Search Execution Error:", e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setQueryError(`Search failed: ${errorMessage}`);
      setResults([]);
      setRawCrimeData([]);
      setTotalRows(0);
    } finally {
      setIsQueryLoading(false);
    }
  }, []);

  // Trigger search whenever the URL search location changes
  useEffect(() => {
    executeSearch(searchLocation, searchDate);
  }, [searchLocation, searchDate, executeSearch]);

  const handleSearchSubmit = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput !== searchLocation || inputDate !== searchDate) {
        setSearchLocation(trimmedInput);
        setSearchDate(inputDate);
    } else {
        // If it's the same, just re-trigger the search manually
        executeSearch(trimmedInput, inputDate);
    }
  };


  const renderContent = () => {
    if (queryError && !isQueryLoading) {
        return (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center" role="alert">
                <p className="font-bold">Error 🛑</p>
                <p className="text-sm">{queryError}</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                <StatCard label="Data Source" value={isFallback ? "Fallback" : "Live API"} emoji={isFallback ? "⚠️" : "✅"} />
                <StatCard label="Returned Records" value={isQueryLoading ? '...' : totalRows.toLocaleString()} emoji="📊" />
                <StatCard label="Query Engine" value={queryEngine} emoji={queryEngine.includes('Duck') ? "🦆" : "🧠"} />
            </div>

            <SearchBar
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                month={inputDate}
                onMonthChange={(e) => setInputDate(e.target.value)}
                onSearch={handleSearchSubmit}
                isLoading={isQueryLoading}
                disabled={isQueryLoading}
            />

            <FallbackBanner isFallback={isFallback} error={apiError} />

            <div className="mt-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2 sm:mb-0">
                        Analytics: {searchLocation} ({searchDate})
                    </h2>
                    <ViewToggle currentView={view} onViewChange={setView} />
                </div>
                 {isQueryLoading ? (
                    <Loader message={`Fetching crime data for "${searchLocation}"...`} />
                ) : view === 'list' ? (
                    <ResultsDisplay
                        results={results}
                        isLoading={false}
                        error={null}
                        searchLocation={searchLocation}
                    />
                ) : (
                    <MapDisplay data={rawCrimeData} center={mapCenter} />
                )}
            </div>
        </>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d] text-zinc-900 dark:text-zinc-300 font-sans text-sm">
        <main className="max-w-6xl mx-auto p-2 sm:p-4">
            <Header />
            {renderContent()}
        </main>
    </div>
  );
};

export default App;