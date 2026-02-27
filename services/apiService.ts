import { type ApiCrimeRecord, isApiCrimeRecord } from '../types';
import { geocodeLocation } from './geocodingService';

const MOCK_DATA_PATH = '/mock-crime-data.json';
const API_BASE_URL = 'https://data.police.uk/api/crimes-street/all-crime';

interface FetchResult {
  data: ApiCrimeRecord[];
  isFallback: boolean;
  error: string | null;
  center: { lat: number; lon: number } | null;
}

/**
 * Fetches crime data for a given location.
 * 
 * This function implements a robust "API-first with fallback" strategy:
 * 1. It first attempts to geocode the natural language `location` string into coordinates.
 * 2. It then uses these coordinates to call the live UK Police API.
 * 3. If any step in the live API process fails (e.g., network error, location not found, API is down),
 *    it catches the exception, logs a warning, and proceeds to load the local mock data.
 * 
 * This ensures the application remains functional and provides a consistent data structure
 * to the rest of the app, while also clearly flagging when fallback data is in use.
 */
export const fetchCrimeData = async (location: string): Promise<FetchResult> => {
  let center: { lat: number; lon: number } | null = null;
  try {
    // Step 1: Geocode the location string to get lat/lng
    const geocodeResult = await geocodeLocation(location);
    center = { lat: parseFloat(geocodeResult.lat), lon: parseFloat(geocodeResult.lon) };


    // Step 2: Fetch data from the live API using the coordinates
    const apiUrl = `${API_BASE_URL}?lat=${center.lat}&lng=${center.lon}&date=2024-04`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    const data: unknown = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.log(`No crime data found from API for "${location}".`);
      // We can still return the center for an empty result set
      return { data: [], isFallback: false, error: null, center };
    }
    
    // Validate data
    const validData = data.filter(isApiCrimeRecord);
    
    console.log(`Successfully fetched ${validData.length} records from the live API for "${location}".`);
    return { data: validData, isFallback: false, error: null, center };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(
      `Live API fetch for "${location}" failed. Reason: ${errorMessage}. Falling back to mock data.`
    );
    // Step 3: Fallback to mock data if any of the above steps fail
    try {
      const fallbackResponse = await fetch(MOCK_DATA_PATH);
      if (!fallbackResponse.ok) {
        throw new Error(`Failed to load mock data file: ${fallbackResponse.statusText}`);
      }
      const fallbackData: unknown = await fallbackResponse.json();
      
      let validFallbackData: ApiCrimeRecord[] = [];
      if (Array.isArray(fallbackData)) {
        validFallbackData = fallbackData.filter(isApiCrimeRecord);
      }
      
      // Calculate center from fallback data
      if (validFallbackData.length > 0) {
        const avgLat = validFallbackData.reduce((sum, rec) => sum + parseFloat(rec.location.latitude), 0) / validFallbackData.length;
        const avgLon = validFallbackData.reduce((sum, rec) => sum + parseFloat(rec.location.longitude), 0) / validFallbackData.length;
        center = { lat: avgLat, lon: avgLon };
      }
      return { data: validFallbackData, isFallback: true, error: errorMessage, center };
    } catch (fallbackError: unknown) {
       console.error("FATAL: Could not load fallback data.", fallbackError);
       const fallbackErrorMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
       throw new Error(`Live API failed and fallback data could not be loaded: ${fallbackErrorMessage}`);
    }
  }
};