import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import type { ApiCrimeRecord } from '../types';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapDisplayProps {
  data: ApiCrimeRecord[];
  center: [number, number];
}

const MapDisplay: React.FC<MapDisplayProps> = ({ data, center }) => {
  // Extract unique categories from the data
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(data.map(r => r.category))).sort();
  }, [data]);

  // State for selected categories
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(uniqueCategories));

  // Reset selected categories when data changes
  useEffect(() => {
    setSelectedCategories(new Set(uniqueCategories));
  }, [uniqueCategories]);

  const toggleCategory = (category: string) => {
    const newSet = new Set(selectedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setSelectedCategories(newSet);
  };

  const toggleAll = () => {
    if (selectedCategories.size === uniqueCategories.length) {
      setSelectedCategories(new Set());
    } else {
      setSelectedCategories(new Set(uniqueCategories));
    }
  };

  // Filter data based on selected categories
  const filteredData = useMemo(() => {
    return data.filter(record => selectedCategories.has(record.category));
  }, [data, selectedCategories]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Category Filters */}
        <div className="flex-1 w-full overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <div className="flex gap-1 min-w-max items-center">
            <button
              onClick={toggleAll}
              className={`px-3 py-1 text-xs transition-colors whitespace-nowrap ${selectedCategories.size === uniqueCategories.length
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
            >
              All Types
            </button>
            {uniqueCategories.map(category => {
              const isSelected = selectedCategories.has(category);
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 text-xs transition-colors whitespace-nowrap ${isSelected
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                >
                  {category.replace(/-/g, ' ')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-[500px] w-full rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
        <MapContainer center={center} zoom={14} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup chunkedLoading>
            {filteredData.map((record) => (
              <Marker
                key={record.id}
                position={[parseFloat(record.location.latitude), parseFloat(record.location.longitude)]}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold text-slate-800 capitalize mb-1">
                      {typeof record.category === 'string' ? record.category.replace(/-/g, ' ') : 'Unknown'}
                    </h3>
                    <p className="text-sm text-slate-600 mb-1">
                      <span className="font-semibold">Location:</span> {record.location.street?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Outcome:</span> {record.outcome_status?.category || 'Not specified'}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapDisplay;
