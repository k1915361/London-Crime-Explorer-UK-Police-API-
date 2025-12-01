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
