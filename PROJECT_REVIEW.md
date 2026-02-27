# Project Review: London Crime Explorer
 
## Overview
London Crime Explorer is an interactive, responsive web application that allows users to search, visualize, and analyze street-level crime data across the UK. Built with modern web technologies, the application provides real-time insights into crime statistics through aggregated lists and interactive heatmaps.

## Key Features
- **Natural Language Location Search**: Integrates OpenStreetMap's Nominatim API to geocode user-friendly location queries (e.g., "Westminster, London") into precise geographic coordinates.
- **Live API Integration with Resilient Fallback**: Fetches real-time data from the official UK Police API. Implements a robust error-handling and fallback mechanism that automatically switches to a local dataset if the live API is unavailable, ensuring uninterrupted user experience.
- **In-Memory Data Processing Engine**: Simulates complex SQL aggregations (`GROUP BY` and `COUNT`) directly in the browser using optimized JavaScript array methods, processing and grouping large datasets efficiently without backend dependencies.
- **Interactive Geospatial Visualization**: Utilizes Leaflet and React-Leaflet to render interactive maps, featuring a custom heatmap layer (`leaflet.heat`) to visually communicate crime density and hotspots.
- **Responsive & Accessible UI**: Designed with Tailwind CSS, offering a polished, mobile-first interface with dark mode support, dynamic stat cards, and seamless toggling between analytical list views and geospatial map views.

## Tech Stack
- **Frontend Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Mapping & Visualization**: Leaflet, React-Leaflet, leaflet.heat
- **APIs**: UK Police API (Data), OpenStreetMap Nominatim API (Geocoding)

---

## CV Bullet Points (For Software Engineer / Full Stack Roles)

Here are a few ways you can frame this project on your CV, depending on the specific role you are applying for. 

### Option 1: Focus on Frontend & API Integration (Frontend Engineer)
* **London Crime Explorer** | *React, TypeScript, Tailwind CSS, Leaflet, REST APIs*
  * Developed an interactive React application to visualize UK street-level crime data, integrating the official UK Police API and OpenStreetMap Nominatim for natural language geocoding.
  * Engineered a resilient "API-first" data fetching strategy with automatic fallback to local datasets, ensuring 100% uptime and a seamless user experience during network or API failures.
  * Implemented an in-memory data aggregation engine using optimized JavaScript methods to process, group, and sort large datasets directly in the browser.
  * Built dynamic geospatial visualizations using Leaflet and React-Leaflet, including a custom heatmap layer to highlight crime density and hotspots.

### Option 2: Focus on Architecture & Performance (Full Stack / Software Engineer)
* **London Crime Explorer** | *TypeScript, React, Vite, Geospatial Data*
  * Architected a client-side data analytics dashboard that processes and visualizes real-time UK crime statistics without a dedicated backend.
  * Designed a robust data pipeline that geocodes user queries, fetches live data from external REST APIs, and gracefully degrades to mock data upon failure.
  * Optimized client-side performance by implementing an in-memory aggregation service, simulating SQL `GROUP BY` operations to instantly generate actionable insights from raw API payloads.
  * Created a responsive, mobile-first UI with Tailwind CSS, featuring seamless state management to toggle between aggregated statistical lists and interactive heatmaps.

### Option 3: Concise (For a packed CV)
* **London Crime Explorer (React, TypeScript, Leaflet):** Built a resilient web app to analyze UK crime data. Integrated OpenStreetMap for geocoding and the UK Police API for real-time data, featuring an automatic fallback mechanism. Developed an in-memory aggregation engine to process datasets and visualized crime hotspots using interactive Leaflet heatmaps.

---

## Talking Points for Interviews
When discussing this project in an interview, you can highlight the following architectural decisions and potential improvements:
- **Resilience over Perfection**: Emphasize the fallback mechanism. It shows you think about edge cases, rate limits, and user experience when relying on third-party APIs.
- **Separation of Concerns**: Mention how the data fetching (`apiService.ts`), data processing (`databaseService.ts`), and UI components are decoupled. This makes the codebase maintainable and testable.
- **Future Scalability**: Discuss how the current in-memory JS aggregation works well for the current payload size, but could be migrated to Web Workers or WebAssembly (like DuckDB-WASM) if the dataset grows to millions of rows, preventing UI thread blocking.
- **Caching Strategy**: Suggest that a future improvement would be implementing client-side caching (e.g., `localStorage` or `IndexedDB`) for previously searched locations to reduce API calls and improve load times.
