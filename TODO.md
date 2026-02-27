# Project TODOs & Improvements

This document tracks the completed features and outlines potential future improvements for the London Crime Explorer application, categorized by architectural and UX concerns.

## ✅ Completed TODOs

### Architecture & Data Fetching
- [x] **Live API Integration**: Successfully connected to the official UK Police API to fetch street-level crime data.
- [x] **Geocoding Integration**: Implemented OpenStreetMap's Nominatim API to convert natural language queries (e.g., "Westminster, London") into latitude/longitude coordinates.
- [x] **Resilient Fallback Mechanism**: Engineered a robust fallback strategy that automatically loads a local mock dataset (`mock-crime-data.json`) if the live API or geocoding service fails.
- [x] **In-Memory Aggregation Engine**: Built a client-side data processing service (`databaseService.ts`) that simulates SQL `GROUP BY` and `COUNT` operations using optimized JavaScript array and Map methods.

### User Experience (UX) & UI
- [x] **Responsive Design**: Developed a mobile-first, responsive interface using Tailwind CSS.
- [x] **Dark Mode Support**: Implemented dark mode styling across all components.
- [x] **Geospatial Visualization**: Integrated Leaflet and React-Leaflet to render interactive maps.
- [x] **Heatmap Layer**: Added `leaflet.heat` to visualize crime density and hotspots on the map.
- [x] **View Toggling**: Allowed users to seamlessly switch between an analytical List View and a Geospatial Map View.
- [x] **Loading States & Feedback**: Added a `Loader` component and a `FallbackBanner` to keep the user informed about data fetching status and source (Live vs. Mock).

### Code Quality & Reliability
- [x] **Error Boundaries**: Implemented an `ErrorBoundary` component to catch unhandled React rendering errors and prevent the entire app from crashing.
- [x] **Separation of Concerns**: Decoupled API fetching, geocoding, and data processing into dedicated service files.

---

## 🚀 Future TODOs & Potential Improvements

### Scalability & Performance
- [x] **Web Workers for Data Processing**: Offload the in-memory data aggregation (`databaseService.ts`) to a Web Worker. This will prevent the main UI thread from blocking when processing datasets with hundreds of thousands of rows.
- [ ] **WebAssembly (WASM) Integration**: Re-introduce DuckDB-WASM (or similar) for handling complex, multi-dimensional SQL queries directly in the browser, providing better performance for massive datasets than standard JS arrays.
- [x] **List Virtualization**: Implement windowing/virtualization (e.g., `react-window` or `@tanstack/react-virtual`) for the `ResultsDisplay` component to efficiently render long lists of aggregated crime data without DOM bloat.

### Quality of Code
- [ ] **Unit Testing**: Add unit tests using Jest or Vitest for critical business logic, specifically `apiService.ts`, `geocodingService.ts`, and `databaseService.ts`.
- [ ] **End-to-End (E2E) Testing**: Implement Cypress or Playwright to automate testing of the critical user journey (Search -> Fetch Data -> View List -> View Map).
- [ ] **Stricter TypeScript Interfaces**: Refine and strictly type the API responses to avoid `any` types and ensure safer data parsing.

### User Experience (UX)
- [ ] **Client-Side Caching**: Implement caching (using `localStorage`, `IndexedDB`, or a library like React Query) for previously searched locations to reduce redundant API calls and improve load times.
- [ ] **URL State Management**: Sync the search query and active view (list/map) with the URL query parameters (e.g., `?location=Westminster&view=map`). This allows users to bookmark and share specific searches.
- [ ] **Date Filtering**: Add a date picker UI to allow users to query crime data for specific months (currently hardcoded to `2024-04` in the API call).
- [ ] **Map Clustering**: Add marker clustering (e.g., `react-leaflet-cluster`) for lower zoom levels, allowing users to toggle between a density heatmap and discrete clustered incidents.
- [ ] Fetch after clicking an area on map

### Error Handling & Fallback
- [ ] **Retry Logic**: Implement a retry mechanism with exponential backoff for the live API requests before triggering the fallback to mock data.
- [ ] **Granular Error Reporting**: Improve the UI to provide more specific error messages to the user (e.g., distinguishing between "Network Offline", "API Rate Limited", and "Location Not Found").
