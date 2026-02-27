import type { CrimeData, ApiCrimeRecord } from '../types';

self.onmessage = (e: MessageEvent) => {
  const data: ApiCrimeRecord[] = e.data;
  
  const aggregationMap = new Map<string, CrimeData>();

  for (const record of data) {
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
  
  // Convert the map to an array, sort by count descending.
  const aggregatedResults = Array.from(aggregationMap.values());
  aggregatedResults.sort((a, b) => b.count - a.count);

  self.postMessage(aggregatedResults);
};
