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
- [x] **Heatmap Layer**: Previously implemented `leaflet.heat` to visualize crime density, but removed in favor of purely using marker clustering to simplify UI and reduce bundle size.
- [x] **View Toggling**: Allowed users to seamlessly switch between an analytical List View and a Geospatial Map View.
- [x] **Loading States & Feedback**: Added a `Loader` component and a `FallbackBanner` to keep the user informed about data fetching status and source (Live vs. Mock).

### Code Quality & Reliability
- [x] **Error Boundaries**: Implemented an `ErrorBoundary` component to catch unhandled React rendering errors and prevent the entire app from crashing.
- [x] **Separation of Concerns**: Decoupled API fetching, geocoding, and data processing into dedicated service files.

---

## 🚀 Future Enhancements (Portfolio / Enterprise-Grade Features)

These features demonstrate modern engineering practices that employers look for in senior or mid-level candidates.

### DevOps & CI/CD
- [x] **Automated CI/CD Pipeline**: Set up GitHub Actions to automatically run strict linting (ESLint/Prettier), type-checking (`tsc`), and unit tests on every Pull Request before allowing merges.
- [ ] **Automated Deployments**: Configure Vercel or Cloudflare Pages to automatically generate preview environments for every branch and deploy to production on `main` merges.
- [ ] **Infrastructure as Code (IaC)**: If the backend scales, define cloud resources using Terraform or AWS CDK.

### Observability & Telemetry
- [ ] **Error Tracking (Sentry)**: Integrate Sentry to automatically capture production errors, source-mapped stack traces, and unhandled promise rejections.
- [ ] **Product Analytics (PostHog)**: Add basic telemetry to understand user drop-off points (e.g., tracking how many users switch from "List" to "Map" view, or what the most frequent search terms are).

### Accessibility (a11y) & Performance (PWA)
- [x] **WCAG Compliance Auditing**: Use standard tools (like Lighthouse / axe) to ensure all interactive elements have correct `aria-labels`, support keyboard-only navigation, and pass contrast ratios.
- [ ] **Progressive Web App (PWA)**: Register a Service Worker (e.g. `vite-plugin-pwa`) to aggressively cache JS/CSS assets and map tiles, allowing the app to load instantly and function offline.

- [] Use Next.js to optimise the app with server-side rendering and bun.js as backend (but compare the pros and cons of current setup react vs next.js with bun.js).

### Scalability & Data Processing
- [x] **Web Workers for Data Processing**: Offload the in-memory data aggregation (`databaseService.ts`) to a Web Worker. This will prevent the main UI thread from blocking when processing datasets with hundreds of thousands of rows.
- [x] **WebAssembly (WASM) Integration**: Re-introduce DuckDB-WASM (or similar) for handling complex, multi-dimensional SQL queries directly in the browser, providing better performance for massive datasets than standard JS arrays.
- [x] **List Virtualization**: Implement windowing/virtualization (e.g., `react-window` or `@tanstack/react-virtual`) for the `ResultsDisplay` component to efficiently render long lists of aggregated crime data without DOM bloat.

### Quality of Code
- [x] **Unit Testing**: Add unit tests using Jest or Vitest for critical business logic, specifically `apiService.ts`, `geocodingService.ts`, and `databaseService.ts`.
- [ ] **End-to-End (E2E) Testing**: Implement Cypress or Playwright to automate testing of the critical user journey (Search -> Fetch Data -> View List -> View Map).
- [x] **Stricter TypeScript Interfaces**: Refine and strictly type the API responses to avoid `any` types and ensure safer data parsing.

### User Experience (UX)
- [ ] **Client-Side Caching**: Implement caching (using `localStorage`, `IndexedDB`, or a library like React Query) for previously searched locations to reduce redundant API calls and improve load times.
- [x] **URL State Management**: Sync the search query and active view (list/map) with the URL query parameters (e.g., `?location=Westminster&view=map`). This allows users to bookmark and share specific searches.
- [x] **Date Filtering**: Add a date picker UI to allow users to query crime data for specific months (currently hardcoded to `2024-04` in the API call).
- [x] **Map Clustering**: Added marker clustering (`react-leaflet-cluster`) for lower zoom levels to visualize density without the performance penalty or visual ambiguity of pure heatmaps.
- [ ] Fetch after clicking a point area on map

### Error Handling & Fallback
- [x] **Retry Logic**: Implement a retry mechanism with exponential backoff for the live API requests before triggering the fallback to mock data.
- [x] **Granular Error Reporting**: Improve the UI to provide more specific error messages to the user (e.g., distinguishing between "Network Offline", "API Rate Limited", and "Location Not Found").

### Advanced Data Pipeline & Map Insights (National/Regional Scale)
- [ ] **Expand Radius via Batch Data Pipeline**: The current UK Police API `street-level` endpoint restricts queries to a 1-mile radius. To query an entire city, county, or the whole UK without rate limits, we are transitioning to a **Batch Data Pipeline** driven by DuckDB.
  - **Data Flow & Architecture:**
    1. **Source**: UK Police Data portal provides bulk monthly ZIP files.
    2. **Extraction & Transformation**: A Python script (`scripts/download_and_convert.py`) downloads the ZIP, extracts the CSVs, cleans headers, and uses DuckDB to compress millions of rows into a single highly optimized `london_crimes.parquet` file.
    3. **Storage**: The `.parquet` file is saved directly into the Vite `public/` directory (serving as a static asset alongside the web app).
    4. **Client-Side Querying**: The web app **does not** communicate with Python. Instead, the React app uses DuckDB-WASM inside the browser to execute SQL queries *directly* against the statically hosted `.parquet` file via HTTP Range Requests. This allows $O(1)$ network transfer for specific columns and $O(N)$ real-time aggregation across millions of rows without a running backend server.
  - **Execution & Update Frequency:** The Python script is a one-off "Batch Tool" executed manually (`python scripts/download_and_convert.py`) or via GitHub Actions once a month when new Police data is released.
- [x] **Choropleth Maps**: Evaluated using GeoJSON boundaries but rejected due to computational overhead ($O(N)$ geometry mapping) and lack of aggregate data in the current API schema.
- [x] **Hexbin Maps**: Evaluated `deck.gl`/`d3-hexbin` but rejected to keep the application lightweight and avoid duplicating the density functionality already provided by Clustering.
- [x] **Time-Series Animation**: Added a `TimelinePlayer` component with a slider and playback controls to watch crime hotspots shift over months or years.
- [x] **Interactive Map Filtering**: Add UI toggles to filter the map by specific crime types (e.g., only show "Burglary" vs "Violent Crime") dynamically without re-fetching data.
