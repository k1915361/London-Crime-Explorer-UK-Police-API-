// Represents the aggregated data ready for display in the UI.
// This structure is kept consistent, so UI components don't need to change
// even if the underlying data source changes.
export interface CrimeData {
  crimeType: string;
  outcome: string | null;
  count: number;
}

// Represents the raw data structure from the (simulated) API.
// This allows us to type-check the data we receive before processing it.
export interface ApiCrimeRecord {
  category: string;
  id: number;
  location: {
    latitude: string;
    street: {
      id: number;
      name: string;
    };
    longitude: string;
  };
  month: string;
  outcome_status: {
    category: string;
    date: string;
  } | null;
}

export function isApiCrimeRecord(obj: unknown): obj is ApiCrimeRecord {
  if (typeof obj !== 'object' || obj === null) return false;
  const record = obj as Record<string, unknown>;
  
  if (typeof record.category !== 'string') return false;
  if (typeof record.id !== 'number') return false;
  if (typeof record.month !== 'string') return false;
  
  if (typeof record.location !== 'object' || record.location === null) return false;
  const location = record.location as Record<string, unknown>;
  if (typeof location.latitude !== 'string') return false;
  if (typeof location.longitude !== 'string') return false;
  
  if (record.outcome_status !== null) {
    if (typeof record.outcome_status !== 'object') return false;
    const outcome = record.outcome_status as Record<string, unknown>;
    if (typeof outcome.category !== 'string') return false;
  }
  
  return true;
}
