import { describe, it, expect, vi, beforeEach } from 'vitest';
import { geocodeLocation } from './geocodingService';

describe('geocodingService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return lat and lon for a valid location', async () => {
    const mockResponse = [{ lat: '51.5074', lon: '-0.1278' }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await geocodeLocation('London');
    expect(result).toEqual({ lat: '51.5074', lon: '-0.1278' });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/search?format=json&q=London&limit=1',
      expect.any(Object)
    );
  });

  it('should throw an error if the response is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(geocodeLocation('London')).rejects.toThrow('Geocoding service returned status 500');
  });

  it('should throw an error if no location is found', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await expect(geocodeLocation('UnknownPlace')).rejects.toThrow('Location not found for query: "UnknownPlace"');
  });
});
