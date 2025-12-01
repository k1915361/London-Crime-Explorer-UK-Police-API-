import type { CrimeData, ApiCrimeRecord } from '../types';

// This is our simulated database class. It holds the data and provides query methods.
// This approach follows the dependency injection principle: the App component will
// depend on an instance of this service, not on a specific data-fetching implementation.
export class CrimeDB {
  private data: ApiCrimeRecord[];

  constructor(data: ApiCrimeRecord[]) {
    this.data = data;
  }

  public getTotalRows(): number {
    return this.data.length;
  }
  
  /**
   * Simulates a SQL `GROUP BY` and `COUNT` query on the loaded dataset.
   * This is performed entirely in-memory using standard JavaScript array methods,
   * making it fast and independent of the data source.
   * It includes defensive checks to handle unexpected API data structures.
   */
  public getAggregatedData(): CrimeData[] {
    // Using a Map is an efficient way to group items.
    const aggregationMap = new Map<string, CrimeData>();

    for (const record of this.data) {
      // Defensively format crimeType, ensuring record.category is a string.
      const crimeType = typeof record.category === 'string'
        ? record.category
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
        : 'Unknown Category';

      // Defensively extract outcome, ensuring it's a string to prevent rendering errors.
      const outcome = (record.outcome_status && typeof record.outcome_status.category === 'string')
        ? record.outcome_status.category
        : 'Not specified';
        
      const key = `${crimeType}|${outcome}`; // Unique key for grouping

      if (!aggregationMap.has(key)) {
        aggregationMap.set(key, { crimeType, outcome, count: 0 });
      }
      
      const current = aggregationMap.get(key)!;
      current.count++;
      aggregationMap.set(key, current);
    }
    
    // Convert the map to an array, sort by count descending, and take top 20.
    const aggregatedResults = Array.from(aggregationMap.values());
    aggregatedResults.sort((a, b) => b.count - a.count);

    return aggregatedResults.slice(0, 20);
  }
}