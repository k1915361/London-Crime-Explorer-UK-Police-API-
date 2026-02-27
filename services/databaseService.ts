import type { CrimeData, ApiCrimeRecord } from '../types';
import DatabaseWorker from './databaseWorker?worker';
import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import MvpWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?worker';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import EhWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?worker';

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    mvp: {
        mainModule: duckdb_wasm,
        mainWorker: 'mvp',
    },
    eh: {
        mainModule: duckdb_wasm_eh,
        mainWorker: 'eh',
    },
};

let globalDbPromise: Promise<duckdb.AsyncDuckDB> | null = null;
let isDuckDbAvailable = true;

async function getDb(): Promise<duckdb.AsyncDuckDB> {
    if (globalDbPromise) return globalDbPromise;

    console.log("Initializing DuckDB...");
    globalDbPromise = new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            console.error("CRITICAL ERROR: DuckDB instantiation timed out. The worker is likely hanging due to missing sourcemaps or Vite bundling issues with WASM.");
            isDuckDbAvailable = false;
            reject(new Error("DuckDB instantiation timed out"));
        }, 5000); // 5 second timeout

        (async () => {
            try {
                console.log("Selecting bundle...");
                const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
                console.log("Bundle selected:", bundle);
                
                console.log("Creating worker...");
                const worker = bundle.mainWorker === 'eh' ? new EhWorker() : new MvpWorker();
                
                console.log("Instantiating AsyncDuckDB...");
                const logger = new duckdb.ConsoleLogger();
                const db = new duckdb.AsyncDuckDB(logger, worker);
                
                console.log("Instantiating with mainModule:", bundle.mainModule);
                await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
                console.log("DuckDB instantiated successfully.");
                clearTimeout(timeoutId);
                resolve(db);
            } catch (e) {
                console.error("CRITICAL ERROR: Error initializing DuckDB:", e);
                isDuckDbAvailable = false;
                clearTimeout(timeoutId);
                reject(e);
            }
        })();
    });

    return globalDbPromise;
}

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
   * Performs a SQL `GROUP BY` and `COUNT` query on the loaded dataset.
   * Attempts to use DuckDB-WASM, but falls back to a standard Web Worker
   * if DuckDB hangs or fails to initialize.
   */
  public async getAggregatedData(): Promise<{ results: CrimeData[], engine: string }> {
    if (isDuckDbAvailable) {
        try {
            const db = await getDb();
            const conn = await db.connect();
            
            const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const fileName = `crimes_${uniqueId}.json`;
            const tableName = `crimes_${uniqueId}`;
            
            try {
              // Transform data to a flat structure for DuckDB
              const flatData = this.data.map(record => {
                const crimeType = typeof record.category === 'string'
                  ? record.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                  : 'Unknown Category';
        
                const outcome = (record.outcome_status && typeof record.outcome_status.category === 'string')
                  ? record.outcome_status.category
                  : 'Not specified';
                  
                return { crimeType, outcome };
              });
        
              // Insert data into DuckDB
              await db.registerFileText(fileName, JSON.stringify(flatData));
              await conn.insertJSONFromPath(fileName, { name: tableName });
        
              // Run SQL query
              const query = `
                SELECT crimeType, outcome, CAST(COUNT(*) AS INTEGER) as count
                FROM ${tableName}
                GROUP BY crimeType, outcome
                ORDER BY count DESC
              `;
              
              const arrowResult = await conn.query(query);
              const results: CrimeData[] = arrowResult.toArray().map((row) => row.toJSON() as CrimeData);
              
              return { results, engine: 'DuckDB-WASM' };
            } finally {
              await conn.close();
              try {
                const cleanupConn = await db.connect();
                await cleanupConn.query(`DROP TABLE IF EXISTS ${tableName}`);
                await cleanupConn.close();
                await db.dropFile(fileName);
              } catch (e) {
                console.error("Cleanup error:", e);
              }
            }
        } catch (e) {
            console.warn("Falling back to Web Worker due to DuckDB failure.");
            // Fallthrough to Web Worker
        }
    }

    // Fallback: Web Worker
    return new Promise((resolve, reject) => {
      const worker = new DatabaseWorker();
      
      worker.onmessage = (e: MessageEvent) => {
        resolve({ results: e.data, engine: 'Web Worker JS' });
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