import os
import zipfile
import tempfile
import duckdb
import requests
from io import BytesIO
from datetime import datetime
from tqdm import tqdm

# Configure standard constants
URL_2024_04 = "https://data.police.uk/data/archive/2024-04.zip" 
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "public", "london_crimes.parquet")

def download_and_extract(url, extract_to):
    """Downloads a ZIP file from the UK Police Data portal and extracts it to a temporary directory."""
    print(f"Downloading data from {url}...")
    try:
        # Stream the download to a temporary file instead of memory
        zip_path = os.path.join(extract_to, "archive.zip")
        with requests.get(url, stream=True) as r:
            r.raise_for_status()
            total_size_in_bytes= int(r.headers.get('content-length', 0))
            block_size = 1048576 # 1 Megabyte
            
            progress_bar = tqdm(total=total_size_in_bytes, unit='iB', unit_scale=True, desc="Downloading ZIP")
            with open(zip_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=block_size):
                    progress_bar.update(len(chunk))
                    f.write(chunk)
            progress_bar.close()
                    
        print("\nDownload complete. Extracting ZIP file...")
        with zipfile.ZipFile(zip_path, 'r') as z:
            # We are interested in the 'metropolitan-street' data.
            # E.g., '2024-04/2024-04-metropolitan-street.csv'
            csv_files = [f for f in z.namelist() if f.endswith('.csv') and ('metropolitan' in f or 'city-of-london' in f)]
            
            print("Extracting only relevant London CSV files...")
            for csv_file in csv_files:
                z.extract(csv_file, extract_to)
                
            if not csv_files:
                raise ValueError("Could not find any London (Metropolitan or City of London) CSV files in the downloaded archive.")
            
            print(f"Found {len(csv_files)} relevant CSV files for London.")
            return [os.path.join(extract_to, f) for f in csv_files]
            
    except Exception as e:
        print(f"Error downloading or extracting data: {e}")
        raise

def process_and_convert(csv_files, output_path):
    """Uses DuckDB to read the raw CSVs, apply standard transformations, and write to an optimized Parquet file."""
    print("Processing CSV files and converting to Parquet...")
    
    # Create the public directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # We use DuckDB here because it can process large CSVs blazingly fast and natively export to Parquet.
    with duckdb.connect() as con:
        # Create a string of file paths for DuckDB e.g. "['path/to/file1.csv', 'path/to/file2.csv']"
        files_str = "[" + ", ".join([f"'{f}'" for f in csv_files]) + "]"
        
        query = f"""
        COPY (
            SELECT 
                "Crime ID" as crime_id,
                Month as month,
                "Reported by" as reported_by,
                "Falls within" as falls_within,
                Longitude as longitude,
                Latitude as latitude,
                Location as location_name,
                "LSOA code" as lsoa_code,
                "LSOA name" as lsoa_name,
                "Crime type" as crime_type,
                "Last outcome category" as outcome,
                Context as context
            FROM read_csv_auto({files_str}, ALL_VARCHAR=TRUE, UNION_BY_NAME=TRUE)
            WHERE Longitude IS NOT NULL AND Latitude IS NOT NULL
        ) TO '{output_path}' (FORMAT PARQUET, COMPRESSION ZSTD);
        """
        
        con.execute(query)
    
    file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Successfully generated optimized Parquet file: {output_path} ({file_size_mb:.2f} MB)")

def main():
    print("--- London Crime Explorer: Batch Data Pipeline ---")
    start_time = datetime.now()
    
    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            csv_files = download_and_extract(URL_2024_04, temp_dir)
            process_and_convert(csv_files, OUTPUT_FILE)
        except Exception as e:
            print(f"Pipeline failed: {e}")
            
    elapsed_time = datetime.now() - start_time
    print(f"Pipeline completed in {elapsed_time.total_seconds():.2f} seconds.")

if __name__ == "__main__":
    main()
