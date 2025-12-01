interface GeocodeResult {
  lat: string;
  lon: string;
}

/**
 * Converts a location query string (e.g., "Westminster, London") into geographic coordinates.
 * This function uses the free and open Nominatim API from OpenStreetMap.
 * @param {string} query The location name to search for.
 * @returns {Promise<GeocodeResult>} A promise that resolves to the latitude and longitude.
 * @throws {Error} If the location cannot be found or the geocoding service fails.
 */
export const geocodeLocation = async (query: string): Promise<GeocodeResult> => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding service returned status ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error(`Location not found for query: "${query}"`);
    }

    const { lat, lon } = data[0];
    return { lat, lon };
  } catch (error) {
    console.error("Geocoding failed:", error);
    // Re-throw the error to be caught by the apiService's fallback logic.
    throw error;
  }
};
