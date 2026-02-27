import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ApiCrimeRecord } from '../types';

// Mock the DuckDB WASM module to avoid loading WASM in tests
vi.mock('@duckdb/duckdb-wasm', () => ({
  selectBundle: vi.fn().mockResolvedValue({
    mainModule: 'mock-module',
    mainWorker: 'mock-worker',
  }),
  ConsoleLogger: vi.fn(),
  AsyncDuckDB: vi.fn().mockImplementation(() => ({
    instantiate: vi.fn().mockResolvedValue(undefined),
    connect: vi.fn().mockResolvedValue({
      insertJSONFromPath: vi.fn().mockResolvedValue(undefined),
      query: vi.fn().mockResolvedValue({
        toArray: () => [
          { toJSON: () => ({ crimeType: 'Anti social behaviour', outcome: 'Not specified', count: 2 }) },
          { toJSON: () => ({ crimeType: 'Burglary', outcome: 'Under investigation', count: 1 }) }
        ]
      }),
      close: vi.fn().mockResolvedValue(undefined),
    }),
    registerFileText: vi.fn().mockResolvedValue(undefined),
    dropFile: vi.fn().mockResolvedValue(undefined),
  })),
}));

// Mock the worker imports
vi.mock('./databaseWorker?worker', () => ({
  default: class MockWorker {
    onmessage: any;
    onerror: any;
    postMessage(data: any) {
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage({ data: [
            { crimeType: 'Anti social behaviour', outcome: 'Not specified', count: 2 },
            { crimeType: 'Burglary', outcome: 'Under investigation', count: 1 }
          ] });
        }
      }, 0);
    }
    terminate() {}
  }
}));

vi.mock('@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?worker', () => ({
  default: class MockWorker {}
}));

vi.mock('@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?worker', () => ({
  default: class MockWorker {}
}));

// Import CrimeDB after mocking
import { CrimeDB } from './databaseService';

const mockData: ApiCrimeRecord[] = [
  {
    id: 1,
    category: 'anti-social-behaviour',
    location: { latitude: '51.5', longitude: '-0.1', street: { id: 1, name: 'Street 1' } },
    month: '2024-04',
    outcome_status: null
  },
  {
    id: 2,
    category: 'anti-social-behaviour',
    location: { latitude: '51.5', longitude: '-0.1', street: { id: 1, name: 'Street 1' } },
    month: '2024-04',
    outcome_status: null
  },
  {
    id: 3,
    category: 'burglary',
    location: { latitude: '51.5', longitude: '-0.1', street: { id: 2, name: 'Street 2' } },
    month: '2024-04',
    outcome_status: { category: 'Under investigation', date: '2024-04' }
  }
];

describe('databaseService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize CrimeDB with data and return total rows', () => {
    const db = new CrimeDB(mockData);
    expect(db.getTotalRows()).toBe(3);
  });

  it('should aggregate data successfully using DuckDB or fallback', async () => {
    const db = new CrimeDB(mockData);
    const { results, engine } = await db.getAggregatedData();
    
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({ crimeType: 'Anti social behaviour', outcome: 'Not specified', count: 2 });
    expect(results[1]).toEqual({ crimeType: 'Burglary', outcome: 'Under investigation', count: 1 });
    // It could be DuckDB or Web Worker depending on the mock behavior, but we just check the results
    expect(['DuckDB-WASM', 'Web Worker JS']).toContain(engine);
  });
});
