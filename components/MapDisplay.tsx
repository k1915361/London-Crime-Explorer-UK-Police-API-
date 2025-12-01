import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import HeatmapLayer from './HeatmapLayer';
import type { ApiCrimeRecord } from '../types';

interface MapDisplayProps {
  data: ApiCrimeRecord[];
  center: [number, number];
}

const MapDisplay: React.FC<MapDisplayProps> = ({ data, center }) => {
  // Convert ApiCrimeRecord to points for the heatmap
  const points = data.map(record => ({
    lat: parseFloat(record.location.latitude),
    lng: parseFloat(record.location.longitude),
    intensity: 1.0 // Each crime incident has a uniform intensity
  }));

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
      <MapContainer center={center} zoom={14} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatmapLayer points={points} />
      </MapContainer>
    </div>
  );
};

export default MapDisplay;
