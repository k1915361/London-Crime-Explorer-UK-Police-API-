import type { CrimeData, ApiCrimeRecord } from '../types';
import DatabaseWorker from './databaseWorker?worker';

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
   * This is performed in a Web Worker to prevent blocking the main UI thread,
   * making it fast and independent of the data source.
   * It includes defensive checks to handle unexpected API data structures.
   */
  public async getAggregatedData(): Promise<CrimeData[]> {
    return new Promise((resolve, reject) => {
      const worker = new DatabaseWorker();
      
      worker.onmessage = (e: MessageEvent) => {
        resolve(e.data);
        worker.terminate();
      };
      
      worker.onerror = (error: ErrorEvent) => {
        reject(new Error(`Worker error: ${error.message}`));
        worker.terminate();
      };
      
      worker.postMessage(this.data);
    });
  }
}