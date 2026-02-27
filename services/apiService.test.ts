import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCrimeData } from './apiService';
import * as geocodingService from './geocodingService';

// Mock the geocoding service
vi.mock('./geocodingService', () => ({
  geocodeLocation: vi.fn(),
}));

describe('apiService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch data from the live API successfully', async () => {
    // Mock geocoding
    vi.mocked(geocodingService.geocodeLocation).mockResolvedValue({ lat: '51.5', lon: '-0.1' });

    // Mock fetch for live API
    const mockApiData = [{ 
      id: 1, 
      category: 'anti-social-behaviour', 
      location: { latitude: '51.5', longitude: '-0.1', street: { id: 1, name: 'Street' } },
      month: '2024-04',
      outcome_status: null
    }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiData,
    });

    const result = await fetchCrimeData('London');

    expect(result.isFallback).toBe(false);
    expect(result.data).toEqual(mockApiData);
    expect(result.center).toEqual({ lat: 51.5, lon: -0.1 });
    expect(result.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith('https://data.police.uk/api/crimes-street/all-crime?lat=51.5&lng=-0.1&date=2024-04');
  });

  it('should return empty data if live API returns empty array', async () => {
    vi.mocked(geocodingService.geocodeLocation).mockResolvedValue({ lat: '51.5', lon: '-0.1' });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await fetchCrimeData('London');

    expect(result.isFallback).toBe(false);
    expect(result.data).toEqual([]);
    expect(result.center).toEqual({ lat: 51.5, lon: -0.1 });
  });

  it('should fallback to mock data if geocoding fails', async () => {
    vi.mocked(geocodingService.geocodeLocation).mockRejectedValue(new Error('Geocoding failed'));

    const mockFallbackData = [{ 
      id: 2, 
      category: 'burglary', 
      location: { latitude: '51.5', longitude: '-0.1', street: { id: 2, name: 'Street' } },
      month: '2024-04',
      outcome_status: { category: 'Under investigation', date: '2024-04' }
    }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      statusText: 'OK',
      json: async () => mockFallbackData,
    });

    const result = await fetchCrimeData('UnknownPlace');

    expect(result.isFallback).toBe(true);
    expect(result.data).toEqual(mockFallbackData);
    expect(result.error).toBe('Geocoding failed');
    expect(global.fetch).toHaveBeenCalledWith('/mock-crime-data.json');
  });

  it('should fallback to mock data if live API fails', async () => {
    vi.mocked(geocodingService.geocodeLocation).mockResolvedValue({ lat: '51.5', lon: '-0.1' });

    const mockFallbackData = [{ 
      id: 2, 
      category: 'burglary', 
      location: { latitude: '51.5', longitude: '-0.1', street: { id: 2, name: 'Street' } },
      month: '2024-04',
      outcome_status: { category: 'Under investigation', date: '2024-04' }
    }];
    
    // First call to live API fails, second call to mock data succeeds
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })
      .mockResolvedValueOnce({
        ok: true,
        statusText: 'OK',
        json: async () => mockFallbackData,
      });

    const result = await fetchCrimeData('London');

    expect(result.isFallback).toBe(true);
    expect(result.data).toEqual(mockFallbackData);
    expect(result.error).toBe('API request failed with status 500: Internal Server Error');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should throw an error if both live API and fallback fail', async () => {
    vi.mocked(geocodingService.geocodeLocation).mockRejectedValue(new Error('Geocoding failed'));

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(fetchCrimeData('London')).rejects.toThrow('Live API failed and fallback data could not be loaded: Failed to load mock data file: Not Found');
  });
});
